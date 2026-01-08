import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token JWT aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  signup: async (email, password, name) => {
    const response = await api.post('/users/signup', { email, password, name });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Services pour les catégories
export const categoryService = {
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getCategoryById: async (categoryId) => {
    const response = await api.get(`/categories/${categoryId}`);
    return response.data;
  }
};

// Services pour les lignes
export const lineService = {
  getAllLines: async () => {
    const response = await api.get('/lines');
    return response.data;
  },

  getLinesByCategory: async (categoryId) => {
    const response = await api.get(`/categories/${categoryId}/lines`);
    return response.data;
  },

  getLinesByType: async (lineType) => {
    const response = await api.get(`/lines?type=${lineType}`);
    return response.data;
  },

  getLineById: async (lineId) => {
    const response = await api.get(`/lines/${lineId}`);
    return response.data;
  },

  getLineStops: async (lineId) => {
    const response = await api.get(`/lines/${lineId}/stops`);
    return response.data;
  },

  updateLine: async (lineId, data) => {
    const response = await api.put(`/lines/${lineId}`, data);
    return response.data;
  },

  addStopToLine: async (lineId, stopData) => {
    const response = await api.post(`/lines/${lineId}/stops`, stopData);
    return response.data;
  },

  removeStopFromLine: async (lineId, stopId) => {
    const response = await api.delete(`/lines/${lineId}/stops/${stopId}`);
    return response.data;
  }
};

// Services pour les statistiques
export const statsService = {
  getDistanceBetweenStops: async (stopId1, stopId2) => {
    const response = await api.get(`/stats/distance/stops/${stopId1}/${stopId2}`);
    return response.data;
  },

  getLineDistance: async (lineId) => {
    const response = await api.get(`/stats/distance/lines/${lineId}`);
    return response.data;
  }
};

export default api;

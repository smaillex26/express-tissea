# API Tisséa - Réseau de Transports Publics

Application complète de gestion des transports publics (Bus, Métro, Tramway) avec une API REST Express.js et un frontend React avec carte interactive Leaflet.

## Technologies Utilisées

### Backend
- **Express.js 5** - Framework web Node.js
- **PostgreSQL** - Base de données relationnelle
- **Prisma ORM** - ORM moderne pour Node.js
- **JWT (JSON Web Tokens)** - Authentification sécurisée
- **bcryptjs** - Hashage des mots de passe

### Frontend
- **React 18** - Bibliothèque UI
- **Vite** - Build tool moderne
- **React Router** - Navigation
- **Leaflet** - Cartes interactives
- **Axios** - Client HTTP

## Prérequis

- **Node.js** >= 18.0.0
- **PostgreSQL** >= 14.0
- **npm** ou **yarn**

## Installation

### 1. Cloner le repository

```bash
git clone https://github.com/votre-username/express-tissea.git
cd express-tissea
```

### 2. Configuration de la base de données PostgreSQL

Créez une base de données PostgreSQL nommée `tissea_db`:

```sql
CREATE DATABASE tissea_db;
```

### 3. Installation du Backend

```bash
cd backend
npm install
```

Créez un fichier `.env` dans le dossier `backend`:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tissea_db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

**Important**: Remplacez `postgres:postgres` par vos identifiants PostgreSQL.

### 4. Migrations et Seeding

Appliquez les migrations Prisma et peuplez la base de données:

```bash
npx prisma migrate dev
npm run seed
```

### 5. Installation du Frontend

```bash
cd ../frontend
npm install
```

## Démarrage

### Backend (Terminal 1)

```bash
cd backend
npm run dev
```

L'API sera accessible sur `http://localhost:5000`

### Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Structure du Projet

```
express-tissea/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Schéma de la base de données
│   │   ├── seed.js            # Données de test
│   │   └── migrations/        # Migrations Prisma
│   ├── src/
│   │   ├── controllers/       # Contrôleurs
│   │   ├── services/          # Logique métier
│   │   ├── routes/            # Routes Express
│   │   ├── middlewares/       # Middlewares (auth, etc.)
│   │   ├── utils/             # Utilitaires (JWT, distance)
│   │   ├── app.js            # Configuration Express
│   │   └── server.js         # Point d'entrée
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/            # Pages React
│   │   ├── components/       # Composants React
│   │   ├── services/         # Services API
│   │   ├── styles/          # Fichiers CSS
│   │   └── App.jsx          # Composant principal
│   └── package.json
└── docs/                     # Documentation
```

## API Endpoints

### Authentification

- **POST** `/api/users/signup` - Inscription
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }
  ```

- **POST** `/api/users/login` - Connexion
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Catégories et Lignes (Authentification requise)

- **GET** `/api/categories/:id/lines` - Liste des lignes par catégorie
- **GET** `/api/lines/:id` - Détails d'une ligne
- **GET** `/api/lines/:id/stops` - Arrêts d'une ligne
- **POST** `/api/lines/:id/stops` - Ajouter un arrêt
- **PUT** `/api/lines/:id` - Modifier une ligne
- **DELETE** `/api/lines/:lineId/stops/:stopId` - Supprimer un arrêt

### Statistiques (Authentification requise)

- **GET** `/api/stats/distance/stops/:id1/:id2` - Distance entre deux arrêts
- **GET** `/api/stats/distance/lines/:id` - Distance totale d'une ligne

## Modèle de Données

### User
- id, email, password, name, createdAt, updatedAt

### Category
- id, name (Bus, Métro, Tramway), createdAt, updatedAt

### Line
- id, name, number, color, categoryId, startTime, endTime, createdAt, updatedAt

### Stop
- id, name, latitude, longitude, createdAt, updatedAt

### LineStop
- id, lineId, stopId, order, createdAt, updatedAt

## Fonctionnalités

### Backend
- Authentification JWT sécurisée
- CRUD complet pour les lignes et arrêts
- Calcul de distance avec la formule de Haversine
- Gestion de l'ordre des arrêts sur une ligne
- Validation des données
- Gestion d'erreurs

### Frontend
- Pages d'inscription et connexion
- Carte interactive Leaflet
- Affichage des lignes de transport
- Marqueurs pour les arrêts
- Tracé des itinéraires
- Sélection dynamique par catégorie
- Interface responsive

## Scripts Disponibles

### Backend
- `npm run dev` - Démarre le serveur en mode développement
- `npm run seed` - Peuple la base de données

### Frontend
- `npm run dev` - Démarre l'application en mode développement
- `npm run build` - Build de production
- `npm run preview` - Prévisualise le build de production

## Données de Test

Après le seeding, vous aurez:
- 3 catégories (Métro, Bus, Tramway)
- Métro ligne B avec 17 arrêts
- Tramway T1 avec 6 arrêts
- Bus 14 avec 4 arrêts

## Calcul de Distance

La formule de Haversine est utilisée pour calculer la distance entre deux points géographiques:

```javascript
R = 6371 km (rayon de la Terre)
distance = 2 * R * arcsin(sqrt(sin²(Δlat/2) + cos(lat1) * cos(lat2) * sin²(Δlon/2)))
```

## Sécurité

- Mots de passe hashés avec bcrypt (10 rounds)
- Authentification JWT avec expiration (7 jours)
- Protection CORS configurée
- Validation des entrées utilisateur

## Contribution

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Licence

MIT

## Auteur

Projet réalisé dans le cadre du cours Express/FastAPI/Laravel

## Support

Pour toute question, ouvrez une issue sur GitHub.

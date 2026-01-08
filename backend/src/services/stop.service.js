import { query } from '../config/database.js';

export const getAllStops = async () => {
  const result = await query('SELECT id, name, latitude, longitude FROM stops ORDER BY name ASC');

  return result.rows.map(row => ({
    id: row.id,
    name: row.name,
    latitude: parseFloat(row.latitude),
    longitude: parseFloat(row.longitude)
  }));
};

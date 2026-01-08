import { query } from '../config/database.js';
import { calculateDistance } from '../utils/distance.js';

export const getDistanceBetweenStops = async (stopId1, stopId2) => {
  const stop1Result = await query(
    'SELECT id, name, latitude, longitude FROM stops WHERE id = $1',
    [parseInt(stopId1)]
  );

  const stop2Result = await query(
    'SELECT id, name, latitude, longitude FROM stops WHERE id = $1',
    [parseInt(stopId2)]
  );

  if (stop1Result.rows.length === 0 || stop2Result.rows.length === 0) {
    throw new Error('Un ou plusieurs arrêts non trouvés');
  }

  const stop1 = stop1Result.rows[0];
  const stop2 = stop2Result.rows[0];

  const distance = calculateDistance(
    parseFloat(stop1.latitude),
    parseFloat(stop1.longitude),
    parseFloat(stop2.latitude),
    parseFloat(stop2.longitude)
  );

  return {
    stop1: {
      id: stop1.id,
      name: stop1.name,
      latitude: parseFloat(stop1.latitude),
      longitude: parseFloat(stop1.longitude)
    },
    stop2: {
      id: stop2.id,
      name: stop2.name,
      latitude: parseFloat(stop2.latitude),
      longitude: parseFloat(stop2.longitude)
    },
    distance: distance
  };
};

import { query, getClient } from '../config/database.js';
import { calculateDistance } from '../utils/distance.js';

export const getAllLines = async () => {
  const result = await query(`
    SELECT
      l.id, l.name, l.number, l.color, l.category_id, l.start_time, l.end_time,
      l.line_type, l.description, l.created_at,
      c.name as category_name,
      COUNT(ls.id) as stops_count
    FROM lines l
    INNER JOIN categories c ON l.category_id = c.id
    LEFT JOIN line_stops ls ON l.id = ls.line_id
    GROUP BY l.id, c.name
    ORDER BY c.name ASC, l.number ASC
  `);

  return result.rows.map(row => ({
    id: row.id,
    name: row.name,
    number: row.number,
    color: row.color,
    categoryId: row.category_id,
    category: row.category_name,
    startTime: row.start_time,
    endTime: row.end_time,
    lineType: row.line_type,
    description: row.description,
    stopsCount: parseInt(row.stops_count),
    createdAt: row.created_at
  }));
};

export const getLineById = async (lineId) => {
  const lineResult = await query(`
    SELECT
      l.id, l.name, l.number, l.color, l.start_time, l.end_time,
      l.line_type, l.description, l.created_at,
      c.name as category_name
    FROM lines l
    INNER JOIN categories c ON l.category_id = c.id
    WHERE l.id = $1
  `, [parseInt(lineId)]);

  if (lineResult.rows.length === 0) {
    throw new Error('Ligne non trouvée');
  }

  const line = lineResult.rows[0];

  // Get stops for this line
  const stopsResult = await query(`
    SELECT s.name
    FROM line_stops ls
    INNER JOIN stops s ON ls.stop_id = s.id
    WHERE ls.line_id = $1
    ORDER BY ls.stop_order ASC
  `, [parseInt(lineId)]);

  return {
    id: line.id,
    name: line.name,
    number: line.number,
    color: line.color,
    category: line.category_name,
    startTime: line.start_time,
    endTime: line.end_time,
    createdAt: line.created_at,
    stops: stopsResult.rows.map(row => row.name)
  };
};

export const getLineStops = async (lineId) => {
  const result = await query(`
    SELECT
      s.id, s.name, s.latitude, s.longitude,
      ls.stop_order as "order"
    FROM line_stops ls
    INNER JOIN stops s ON ls.stop_id = s.id
    WHERE ls.line_id = $1
    ORDER BY ls.stop_order ASC
  `, [parseInt(lineId)]);

  if (result.rows.length === 0) {
    // Check if line exists
    const lineCheck = await query('SELECT id FROM lines WHERE id = $1', [parseInt(lineId)]);
    if (lineCheck.rows.length === 0) {
      throw new Error('Ligne non trouvée');
    }
  }

  return result.rows.map(row => ({
    id: row.id,
    name: row.name,
    latitude: parseFloat(row.latitude),
    longitude: parseFloat(row.longitude),
    order: row.order
  }));
};

export const updateLine = async (lineId, data) => {
  const updates = [];
  const values = [];
  let paramCounter = 1;

  if (data.name) {
    updates.push(`name = $${paramCounter++}`);
    values.push(data.name);
  }
  if (data.number) {
    updates.push(`number = $${paramCounter++}`);
    values.push(data.number);
  }
  if (data.color) {
    updates.push(`color = $${paramCounter++}`);
    values.push(data.color);
  }
  if (data.startTime) {
    updates.push(`start_time = $${paramCounter++}`);
    values.push(data.startTime);
  }
  if (data.endTime) {
    updates.push(`end_time = $${paramCounter++}`);
    values.push(data.endTime);
  }

  if (updates.length === 0) {
    throw new Error('Aucune donnée à mettre à jour');
  }

  values.push(parseInt(lineId));

  const result = await query(`
    UPDATE lines
    SET ${updates.join(', ')}
    WHERE id = $${paramCounter}
    RETURNING *
  `, values);

  if (result.rows.length === 0) {
    throw new Error('Ligne non trouvée');
  }

  return result.rows[0];
};

export const addStopToLine = async (lineId, stopData) => {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    // Check if line exists
    const lineCheck = await client.query('SELECT id FROM lines WHERE id = $1', [parseInt(lineId)]);
    if (lineCheck.rows.length === 0) {
      throw new Error('Ligne non trouvée');
    }

    // Get next order number
    const orderResult = await client.query(
      'SELECT COALESCE(MAX(stop_order), 0) + 1 as next_order FROM line_stops WHERE line_id = $1',
      [parseInt(lineId)]
    );
    const nextOrder = orderResult.rows[0].next_order;

    // Create stop
    const stopResult = await client.query(
      'INSERT INTO stops (name, latitude, longitude) VALUES ($1, $2, $3) RETURNING id, name, latitude, longitude',
      [stopData.name, stopData.latitude, stopData.longitude]
    );
    const stop = stopResult.rows[0];

    // Link stop to line
    await client.query(
      'INSERT INTO line_stops (line_id, stop_id, stop_order) VALUES ($1, $2, $3)',
      [parseInt(lineId), stop.id, nextOrder]
    );

    await client.query('COMMIT');

    return {
      id: stop.id,
      name: stop.name,
      latitude: parseFloat(stop.latitude),
      longitude: parseFloat(stop.longitude),
      order: nextOrder
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const removeStopFromLine = async (lineId, stopId) => {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    // Delete line_stop
    const deleteResult = await client.query(
      'DELETE FROM line_stops WHERE line_id = $1 AND stop_id = $2',
      [parseInt(lineId), parseInt(stopId)]
    );

    if (deleteResult.rowCount === 0) {
      throw new Error('Arrêt non trouvé sur cette ligne');
    }

    // Reorder remaining stops
    await client.query(`
      UPDATE line_stops
      SET stop_order = subquery.new_order
      FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY stop_order) as new_order
        FROM line_stops
        WHERE line_id = $1
      ) as subquery
      WHERE line_stops.id = subquery.id
    `, [parseInt(lineId)]);

    await client.query('COMMIT');

    return { message: 'Arrêt supprimé et ordre réorganisé' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const calculateLineDistance = async (lineId) => {
  const stops = await getLineStops(lineId);

  if (stops.length < 2) {
    return 0;
  }

  let totalDistance = 0;

  for (let i = 0; i < stops.length - 1; i++) {
    const distance = calculateDistance(
      stops[i].latitude,
      stops[i].longitude,
      stops[i + 1].latitude,
      stops[i + 1].longitude
    );
    totalDistance += distance;
  }

  return Math.round(totalDistance * 100) / 100;
};

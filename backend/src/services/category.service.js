import { query } from '../config/database.js';

export const getLinesByCategory = async (categoryId) => {
  // Check if category exists
  const categoryCheck = await query(
    'SELECT id, name FROM categories WHERE id = $1',
    [parseInt(categoryId)]
  );

  if (categoryCheck.rows.length === 0) {
    throw new Error('Catégorie non trouvée');
  }

  // Get lines for this category
  const result = await query(`
    SELECT
      l.id, l.name, l.number, l.color, l.category_id, l.start_time, l.end_time,
      l.line_type, l.description, l.created_at,
      c.name as category_name
    FROM lines l
    INNER JOIN categories c ON l.category_id = c.id
    WHERE l.category_id = $1
    ORDER BY l.number ASC
  `, [parseInt(categoryId)]);

  return result.rows.map(row => ({
    id: row.id,
    name: row.name,
    number: row.number,
    color: row.color,
    categoryId: row.category_id,
    category: {
      id: row.category_id,
      name: row.category_name
    },
    startTime: row.start_time,
    endTime: row.end_time,
    lineType: row.line_type,
    description: row.description,
    createdAt: row.created_at
  }));
};

import * as categoryService from '../services/category.service.js';

export const getLinesByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const lines = await categoryService.getLinesByCategory(id);
    res.json(lines);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

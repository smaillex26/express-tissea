import * as statsService from '../services/stats.service.js';

export const getDistanceBetweenStops = async (req, res) => {
  try {
    const { id1, id2 } = req.params;
    const result = await statsService.getDistanceBetweenStops(id1, id2);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

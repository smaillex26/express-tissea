import * as lineService from '../services/line.service.js';

export const getAllLines = async (req, res) => {
  try {
    const lines = await lineService.getAllLines();
    res.json(lines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLineById = async (req, res) => {
  try {
    const { id } = req.params;
    const line = await lineService.getLineById(id);
    res.json(line);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getLineStops = async (req, res) => {
  try {
    const { id } = req.params;
    const stops = await lineService.getLineStops(id);
    res.json(stops);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const updateLine = async (req, res) => {
  try {
    const { id } = req.params;
    const line = await lineService.updateLine(id, req.body);
    res.json(line);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const addStopToLine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, latitude, longitude } = req.body;

    if (!name || !latitude || !longitude) {
      return res.status(400).json({ error: 'Nom, latitude et longitude requis' });
    }

    const lineStop = await lineService.addStopToLine(id, { name, latitude, longitude });
    res.status(201).json(lineStop);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeStopFromLine = async (req, res) => {
  try {
    const { lineId, stopId } = req.params;
    const result = await lineService.removeStopFromLine(lineId, stopId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const calculateLineDistance = async (req, res) => {
  try {
    const { id } = req.params;
    const distance = await lineService.calculateLineDistance(id);
    res.json({ lineId: parseInt(id), distance });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

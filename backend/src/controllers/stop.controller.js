import { getAllStops } from "../services/stop.service.js";

export const getStops = async (req, res) => {
  try {
    const stops = await getAllStops();
    res.json(stops);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

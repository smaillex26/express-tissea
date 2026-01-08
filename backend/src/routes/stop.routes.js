import { Router } from "express";
import { getStops } from "../controllers/stop.controller.js";

const router = Router();

router.get("/stops", getStops);

export default router;

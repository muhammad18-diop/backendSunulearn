import express from "express";
import { getStats } from "../controllers/dashboard.controller.js";
import {protect} from "../middlewares/protect.middleware.js"
import {adminOnly} from "../middlewares/adminOnly.middleware.js"


const router = express.Router();


router.get("/stats", protect, getStats);

export default router;

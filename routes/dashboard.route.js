import express from "express";
import { getStats } from "../controllers/dashboard.controller.js";
import {protect} from "../middlewares/protect.middleware.js"
import {adminOnly} from "../middlewares/adminOnly.middleware.js"


const router = express.Router();


router.get("/stats", adminOnly, getStats);

export default router;

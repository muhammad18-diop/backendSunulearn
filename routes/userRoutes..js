import express from "express";
import {
    getProfile,
    updateProfile
} from "../controllers/userController.js";

import {
    protect
} from "../middlewares/auth1.middleware.js";

const router = express.Router();

router.get("/me", protect, getProfile);
router.put("/update", protect, updateProfile);

export default router;
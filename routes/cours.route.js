import express from "express";
import { addCourse } from "../controllers/cours.controller.js";
import { uploadCoursFiles } from "../config/multer.js";

const router = express.Router();

// upload middleware + controller
router.post("/add", uploadCoursFiles, addCourse);

export default router;
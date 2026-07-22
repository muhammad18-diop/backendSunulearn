import express from "express";
import { uploadDevoir } from "../controllers/devoir.controller.js";
import { uploadDevoirFile } from "../middlewares/uploadDevoir.js";


const router = express.Router();


router.post(
    "/upload",
    uploadDevoirFile,
    uploadDevoir
);


export default router;
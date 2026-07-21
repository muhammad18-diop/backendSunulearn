import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {

        if (file.fieldname === "pdfFile") {
            return {
                folder: "cours/pdfs",
                resource_type: "raw",
                public_id: `${Date.now()}-${file.originalname.split(".")[0]}`
            };
        }

        if (file.fieldname === "imageFile") {
            return {
                folder: "cours/images",
                resource_type: "image",
                public_id: `${Date.now()}-${file.originalname.split(".")[0]}`
            };
        }
    }
});

const fileFilter = (req, file, cb) => {

    const allowedPdf = ["application/pdf"];
    const allowedImages = ["image/jpeg", "image/png", "image/jpg"];

    if (
        (file.fieldname === "pdfFile" && allowedPdf.includes(file.mimetype)) ||
        (file.fieldname === "imageFile" && allowedImages.includes(file.mimetype))
    ) {
        cb(null, true);
    } else {
        cb(new Error("Format de fichier non supporté"), false);
    }
};

export const uploadCoursFiles = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024
    }
}).fields([
    { name: "pdfFile", maxCount: 1 },
    { name: "imageFile", maxCount: 1 }
]);

export { cloudinary };
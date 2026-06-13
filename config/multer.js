import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        if (file.fieldname === "pdfFile") {
            cb(null, "uploads/pdfs");
        } 
        else if (file.fieldname === "imageFile") {
            cb(null, "uploads/images");
        } 
        else {
            cb(null, "uploads");
        }
    },

    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
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
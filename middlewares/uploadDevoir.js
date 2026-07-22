import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const storage = new CloudinaryStorage({

    cloudinary,

    params: {
        folder: "devoirs",
        resource_type: "raw",

        public_id: (req, file) => {
            return `${Date.now()}-${file.originalname.split(".")[0]}`;
        }
    }

});


const fileFilter = (req, file, cb)=>{

    const formats = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/zip"
    ];


    if(formats.includes(file.mimetype)){
        cb(null,true);
    }
    else{
        cb(new Error("Format non supporté"),false);
    }

}



export const uploadDevoirFile = multer({

    storage,

    fileFilter,

    limits:{
        fileSize:20 * 1024 * 1024
    }

}).single("devoirFile");
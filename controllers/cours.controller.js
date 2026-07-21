import pool from "../config/db.js"

export const addCourse = async (req, res) => {
    try {
        const { titre, description, categorie } = req.body;

        // Validation
        if (!titre || !description) {
            return res.status(400).json({
                success: false,
                message: "Titre et description obligatoires"
            });
        }

        // Vérification du PDF
        if (!req.files?.pdfFile?.[0]) {
            return res.status(400).json({
                success: false,
                message: "Le fichier PDF est obligatoire"
            });
        }

        // URLs Cloudinary
        const pdfUrl = req.files.pdfFile[0].path;
        const imageUrl = req.files.imageFile?.[0]?.path || null;

        // Si tu utilises aussi les public_id (utile pour supprimer plus tard)
        const pdfPublicId = req.files.pdfFile[0].filename;
        const imagePublicId = req.files.imageFile?.[0]?.filename || null;

        // Création de l'objet
        /*const newCourse = {
            titre,
            description,
            categorie,
            pdfUrl,
            imageUrl,
            pdfPublicId,
            imagePublicId
        };*/

        const result = await pool.query(
            `INSERT INTO courses (titre, description, image, lien, categorie, pdf_public_id, image_public_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
            `,
            [
            titre,
            description,
            imageUrl,
            pdfUrl,
            categorie,
            pdfPublicId,
            imagePublicId
            ]
        )

        // Ici tu peux enregistrer dans la base de données
        // await Course.create(newCourse);

        return res.status(201).json({
            success: true,
            message: "Cours ajouté avec succès",
            course: result.rows[0]
        });

    } catch (error) {
        console.error("UPLOAD ERROR :", error);

        return res.status(500).json({
            success: false,
            message: "Erreur lors de l'ajout du cours",
            error: error.message
        });
    }
};
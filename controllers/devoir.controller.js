import pool from "../config/db.js";

export const uploadDevoir = async (req, res) => {
    try {
        const { nom, titre, commentaire } = req.body;

        if (!nom || !titre) {
            return res.status(400).json({
                success: false,
                message: "Nom et titre obligatoires"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Veuillez sélectionner un fichier."
            });
        }

        const fichierUrl = req.file.path;
        const publicId = req.file.filename;

        const result = await pool.query(
            `
            INSERT INTO devoirs
            (nom, titre, commentaire, fichier_url, public_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
            `,
            [
                nom,
                titre,
                commentaire,
                fichierUrl,
                publicId
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Devoir envoyé avec succès",
            devoir: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Erreur serveur"
        });
    }
};
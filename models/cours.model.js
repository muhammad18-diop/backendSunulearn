import db from "../config/db.js";

export const createCourseInDB = async (titre, description, imageUrl, pdfUrl, categorie) => {
    try {
        const queryText = `
            INSERT INTO courses (titre, description, image, lien, categorie)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [titre, description, imageUrl, pdfUrl, categorie];
        const result = await db.query(queryText, values);
        return result.rows[0];
    } catch (error) {
        console.error("Erreur SQL dans createCourseInDB :", error.message);
        throw error;
    }
};

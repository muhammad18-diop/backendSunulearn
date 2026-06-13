import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token manquant"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const result = await pool.query(
            "SELECT id, nom, email, role FROM users WHERE id = $1",
            [decoded.id]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Utilisateur introuvable"
            });
        }

        req.user = result.rows[0];

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token invalide"
        });
    }
};
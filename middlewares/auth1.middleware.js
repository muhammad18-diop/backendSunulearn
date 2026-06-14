import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Non autorisé"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const result = await pool.query(
            `SELECT id, name, email, role, avatar
             FROM users
             WHERE id = $1`,
            [decoded.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Utilisateur introuvable"
            });
        }

        req.user = result.rows[0];

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Token invalide"
        });
    }
};
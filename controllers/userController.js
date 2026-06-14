import pool from "../config/db.js";

export const getProfile = async (req, res) => {
    res.status(200).json(req.user);
};

export const updateProfile = async (req, res) => {
    try {
        const { name, email, avatar } = req.body;

        const result = await pool.query(
            `UPDATE users
             SET name = $1,
                 email = $2,
                 avatar = $3
             WHERE id = $4
             RETURNING id, name, email, role, avatar`,
            [
                name,
                email,
                avatar,
                req.user.id
            ]
        );

        res.status(200).json({
            success: true,
            user: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
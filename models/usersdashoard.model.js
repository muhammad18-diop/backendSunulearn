import db from "../config/db.js";


export const getAllUsers = async () => {
    const result = await db.query(`
        SELECT id, name, email, role, is_active, created_at
        FROM users
        ORDER BY created_at DESC
    `);

    return result.rows;
};


export const deleteUserById = async (id) => {
    const result = await db.query(`
        DELETE FROM users
        WHERE id = $1
        RETURNING *
    `, [id]);

    return result.rows[0];
};
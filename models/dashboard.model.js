import db from "../config/db.js";

export const getDashboardStats = async () => {
    try {
        const totalUsers = await db.query(`
            SELECT COUNT(*) AS total_users
            FROM users
        `);

        const activeUsers = await db.query(`
            SELECT COUNT(*) AS active_users
            FROM users
            WHERE is_active = true
        `);

        return {
            totalUsers: Number(totalUsers.rows[0].total_users),
            activeUsers: Number(activeUsers.rows[0].active_users)
        };
    } catch (error) {
        console.error("Erreur SQL dans getDashboardStats :", error.message);
        throw error;
    }
};
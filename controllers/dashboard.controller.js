import { getDashboardStats } from "../models/dashboard.model.js"; 

export const getStats = async (req, res) => {
    try {
        const stats = await getDashboardStats();
        
        
        return res.status(200).json({
            success: true,
            stats: stats
        });
    } catch (error) {
        console.error("Erreur contrôleur dashboard :", error);
        return res.status(500).json({
            success: false,
            message: "Erreur interne du serveur lors de la récupération des statistiques."
        });
    }
};
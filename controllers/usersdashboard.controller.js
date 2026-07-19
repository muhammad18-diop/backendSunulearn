import { getAllUsers, deleteUserById } from "../models/usersdashoard.model.js";


export const getUsers = async (req, res) => {
    try {

        const users = await getAllUsers();

        res.status(200).json({
            success: true,
            users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const deleteUser = async (req, res) => {
    try {

        const { id } = req.params;

        const deletedUser = await deleteUserById(id);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur introuvable"
            });
        }

        res.status(200).json({
            success: true,
            message: "Utilisateur supprimé",
            user: deletedUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
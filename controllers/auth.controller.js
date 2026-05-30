import bcrypt from "bcrypt"
import User from "../models/user.model.js"
import generateToken from "../utils/generateToken.js"

export const signup = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const existingUser =
            await User.findByEmail(email);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "Email déjà utilisé"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        await User.create(
            name,
            email,
            hashedPassword
        );

        res.status(201).json({
            message: "Utilisateur créé"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Erreur serveur"
        });

    }

};

export const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const result =
            await User.findByEmail(email);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Utilisateur introuvable"
            });
        }

        const user = result.rows[0];

        const validPassword =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!validPassword) {
            return res.status(401).json({
                message:
                    "Email ou mot de passe incorrect"
            });
        }

        const token =
            generateToken(user.id);

        res.json({
            message: "Connexion réussie",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Erreur serveur"
        });

    }

};
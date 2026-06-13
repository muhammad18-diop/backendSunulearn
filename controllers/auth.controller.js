import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

// SIGNUP
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }

        const existingUser = await User.findByEmail(email);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "Email déjà utilisé" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create(name, email, hashedPassword);

        res.status(201).json({ message: "Utilisateur créé" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email et mot de passe requis" });
        }

        const result = await User.findByEmail(email);

        if (!result || result.rows.length === 0) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        const user = result.rows[0];

        if (!user.password) {
            return res.status(500).json({ message: "Mot de passe invalide en base" });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const token = generateToken(user.id);

        return res.json({
            message: "Connexion réussie",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
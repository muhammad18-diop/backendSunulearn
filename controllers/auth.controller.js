import bcrypt from "bcrypt"
import User from "../models/user.model.js"
import generateToken from "../utils/generateToken.js"

export const signup = async (req, res) => {
    const { name, email, password } = req.body

    User.findByEmail(email, async (err, results) => {
        if (err) return res.status(500).json(err)

        if (results.length > 0) {
            return res.status(400).json({
                message: "Email déjà utilisé"
            })
        }

        const mdpCacher = await bcrypt.hash(password, 10)

        User.create(name, email, mdpCacher, (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json(err)
            }
            return res.status(201).json({
                message: "Utilisateur créé"
            })
        })
    })
}

export const login = (req, res) => {
    const { email, password } = req.body

    User.findByEmail(email, async (err, results) => {
        if (err) return res.status(500).json(err)

        if (results.length === 0) {
            return res.status(404).json({
                message: "Utilisateur introuvable"
            })
        }

        const user = results[0]
        const validPassword = await bcrypt.compare(password, user.PASSWORD)

        if (!validPassword) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect"
            })
        }

        const token = generateToken(user.id)

        return res.json({
            message: "Connexion réussie",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    })
}
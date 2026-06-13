import jwt from "jsonwebtoken";

// Définition correcte de la fonction qui reçoit l'id de l'utilisateur en paramètre
const generateToken = (id) => {
    // Utilisation de la syntaxe standard en MAJUSCULES avec votre clé de secours
    const secret = process.env.JWT_SECRET || 'variabletemporaireSunulearn';

    // Retourne le jeton généré
    return jwt.sign(
        { id },
        secret,
        { expiresIn: "7d" }
    );
};

export default generateToken;

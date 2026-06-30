import jwt from "jsonwebtoken";


const generateToken = (id) => {
    
    const secret = process.env.JWT_SECRET || 'variabletemporaireSunulearn';

    
    return jwt.sign(
        { id },
        secret,
        { expiresIn: "7d" }
    );
};

export default generateToken;

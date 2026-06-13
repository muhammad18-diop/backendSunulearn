import db from "../config/db.js";

const User = {
    create: (name, email, password) => {
        return db.query(
            "INSERT INTO users(name,email,password) VALUES($1,$2,$3)",
            [name, email, password]
        );
    },

    findByEmail: (email) => {
        return db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
    }
};

export default User;
import db from "../config/db.js";

const User = {

    create: async (name, email, password) => {

        return await db.query(
            `INSERT INTO users(name,email,password)
             VALUES($1,$2,$3)`,
            [name, email, password]
        );

    },

    findByEmail: async (email) => {

        return await db.query(
            `SELECT * FROM users
             WHERE email = $1`,
            [email]
        );

    }

};

export default User;
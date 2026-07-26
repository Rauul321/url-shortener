import bcrypt from "bcrypt";
import {pool} from '../db.js'

export async function registerUser(username, email, passwd) {
    try {
        const saltRounds = 10;
        const passwd_hash = await bcrypt.hash(passwd, saltRounds);

        const queryString = `
            INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, username, email;
        `;
        const result = await pool.query(queryString, [username, email, passwd_hash]);
        return result.rows[0];
    } catch (err) {
        console.error("Error saving credentials in database:", err.message);
        throw err;
    }
}

export async function validateCredentials(email, passwd) {
    try {
        const queryString = `
            SELECT id, username, email, password FROM users
            WHERE email = $1;
        `;
        const result = await pool.query(queryString, [email]);

        const dummyHash = "$2b$10$abcdefghijklmnopqrstuuuuuuuuuuuuuuuuuuuuuuuuuuuuu";
        const user = result.rows[0];
        const hashToCompare = user ? user.password : dummyHash;

        const isValid = await bcrypt.compare(passwd, hashToCompare);

        if (user && isValid) {
            delete user.password; // No exponer la contraseña
            return user;
        }

        return null;
    } catch (err) {
        console.error("Error trying to validate credentials:", err.message);
        throw err;
    }
}
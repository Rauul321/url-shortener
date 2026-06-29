import bcrypt from "bcrypt";
import {pool} from '../db.js'

export async function registerUser(username, email, passwd_hash) {
    try {
        const queryString = `
            INSERT INTO users (username, email, password)
            VALUES($1, $2, $3);
        `;
        await pool.query(queryString, [username, email, passwd_hash]);
    } catch (err) {
        console.log("Error saving credentials in database:", err.message);
        throw err;
    }
}

export async function validateCredentials(email, passwd){
    try {
        const queryString = `
            SELECT id, email, password FROM users
            WHERE email = $1;
        `;
        const result = await pool.query(queryString, [email]);
        if(result.rows.length === 0) {
            return null;
        }
        if(await bcrypt.compare(passwd, result.rows[0].password)) {
            return result.rows[0];
        }
        return null;
    } catch (err) {
        console.log("Error trying to validate credentials", err.message);
        throw err;
    }
}
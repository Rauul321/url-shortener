import { Pool } from "pg";


const isProduction = process.env.NODE_ENV === 'production';

export const pool = new Pool(
    isProduction
        ? {
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        }
        : {

            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'admin123',
            database: process.env.DB_NAME || 'shortener_db',
            ssl: false // Sin SSL en local
        }
);

export default async function initDB() {
    try {
        await pool.connect();
        console.log("Connected to PostgreSQL (Supabase)");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS urlmap (
                code VARCHAR(6) PRIMARY KEY,
                originalurl TEXT NOT NULL,
                num_clicks INTEGER DEFAULT 0
            );
            CREATE TABLE IF NOT EXISTS users (
                id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                username VARCHAR(50) NOT NULL,
                password VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL
            );
            CREATE TABLE IF NOT EXISTS user_links (
                user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
                code VARCHAR(6) REFERENCES urlmap(code) ON DELETE CASCADE,
                PRIMARY KEY (user_id, code)
            );
        `);
        console.log("urlmap, users and user_links Tables created/verified");
    } catch(err) {
        console.error("Error initializing database", );
        process.exit(1);
    }
}
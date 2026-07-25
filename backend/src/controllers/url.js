import {pool} from '../db.js'
import crypto from "crypto";

export async function saveUrl(code, url, userId = null) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const queryUrlMap = `
            INSERT INTO urlmap 
            VALUES($1, $2, 0);                       
        `;

        await client.query(queryUrlMap, [code, url]);

        if(userId) {
            const queryUserLinks = `
                INSERT INTO user_links (user_id, code)
                VALUES ($1, $2);
            `
            await client.query(queryUserLinks, [userId, code]);
        }

        await client.query('COMMIT')

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error while saving URL in database:', err.message);
        throw err;
    } finally {
        client.release();
    }
}



export async function getUrl(code) {
    try {
        const queryText = `
            SELECT originalurl FROM urlmap
            WHERE code = $1;
        `;
        const result = await pool.query(queryText, [code]);

        if(result.rows.length === 0){
            return null;
        }

        console.log("Fila completa encontrada en la BD:", result.rows[0]);

        return result.rows[0].originalurl;

    } catch (err) {
        console.error("Error while getting an url from code:", code, err.message);
        throw err;
    }
}

export async function incrementClicks(code) {
    const queryText = `
        UPDATE urlmap SET num_clicks = num_clicks + 1
        WHERE code = $1;
    `;
    try {
        const result = await pool.query(queryText, [code]);
        if(result.rowsAffected === 0) {
            console.log("Any row was affected by the query");
        } else if(result.rowsAffected > 1) {
            console.log("More than one rows were affected. Unexpected behavior");
        } else {
            console.log(`The number of clicks of url with code: ${code}, was incremented`);
        }
    } catch(err) {
        console.log(err.message)
        throw err;
    }
}

export async function getNumClicks(code) {
    const queryText = `
        SELECT num_clicks FROM urlmap
        WHERE code = $1;
    `;
    try {
        const result = await pool.query(queryText, [code]);
        if(result.rows[0].length === 0) {
            return null;
        }
        return result.rows[0].num_clicks;
    } catch (err) {
        console.log("Error while obtaining metrics from code:", code);
        throw err;
    }
}

export async function getUserUrls(id) {
    const queryText = `
        SELECT ul.code, um.num_clicks AS clicks
        FROM user_links ul
        JOIN urlmap um ON ul.code = um.code
        WHERE ul.user_id = $1;
    `;

    try {
        const result = await pool.query(queryText, [id]);
        if(result.rows.length === 0) {
            return [];
        }
        return result.rows;
    } catch (err) {
        console.log('Error while obtaining urls from user:', id);
        throw err;
    }
}
const express = require("express");
const {request} = require("express");
const app = express();
const crypto = require("crypto");
const { Pool } = require("pg")
require('dotenv').config();
const cors = require("cors");
const QRCode = require('qrcode');
const PDFDoc = require('pdfkit');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: false
})

app.use(cors({
    origin: "http://localhost:5173", // El puerto exacto donde corre tu React
    methods: ["GET", "POST"],        // Los métodos que vas a permitir
    credentials: true
}));

async function saveUrl(code, url) {
    try {
        const queryText = `
            INSERT INTO urlmap 
            VALUES($1, $2, 0);                       
        `;

        const values = [code, url];

        await pool.query(queryText, values);

    } catch (err) {
        console.error("Error while saving an URL in database: ", err.message);
        process.exit(1);
    }
}

async function getUrl(code) {
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

async function incrementClicks(code) {
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

async function getNumClicks(code) {
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

async function initDB() {
    try {
        await pool.connect();
        console.log("Connected to PostgreSQL");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS urlmap (
                code VARCHAR(6) PRIMARY KEY,
                originalurl TEXT NOT NULL,
                num_clicks INTEGER DEFAULT 0
            );
        `);
        console.log("urlmap Table created/verified");
    } catch(err) {
        console.error("Error initializing database:", err.message);
        process.exit(1);
    }
}

app.use(express.json());

app.get("/", (req, res) => {
    res.send("URL Shortener API is working fine!")
})

app.post("/api/url", async (req, res) => {
    const originalUrl = req.body.url
    if(!originalUrl.startsWith("https://") && !originalUrl.startsWith("http://")) {
        console.log("URL is invalid\n")
    }

    const code = generateCode()

    await saveUrl(code, originalUrl);

    const shortUrl = `http://localhost:3000/${code}`;

    return res.json({
        code,
        shortUrl,
    });
});

app.get("/:code", async (req, res) => {
    try {
        const {code} = req.params;
        console.log("Codigo pasado a getUrl():", code);
        const originalUrl = await getUrl(code);

        if (!originalUrl) {
            return res.status(404).send("URL no encontrada");
        }
        await incrementClicks(code);
        res.redirect(originalUrl);
    } catch(err) {
        console.error(err.message);
    }
});

app.post("/:code/qr", async (req, res) => {
    try {
        const { code } = req.params;
        const shortLink = `http://localhost:3000/${code}`;
        const qr = await QRCode.toBuffer(shortLink, {type: 'png', width: 300});
        res.setHeader('Content-Disposition', 'attachment; filename="your_short_link.pdf"');
        res.setHeader('Content-Type', 'application/pdf');

        const doc = new PDFDoc();
        doc.pipe(res);
        doc.moveDown();
        doc.image(qr, {
            fit: [450, 450],
            align: 'center',
            valign: 'center'
        });
        doc.end();
    } catch (err) {
        console.log("Error during QR generation:", err);
        res.status(500).send("Error generating PDF, please try again later");
    }
});

app.get("/:code/metrics", async (req, res) => {
    try {
        const { code } = req.params;
        const num_clicks = await getNumClicks(code);
        return res.json({
            num_clicks,
        });
    } catch (err) {
        console.error(err.message);
    }
});


function generateCode(){
    try {
        return crypto.randomBytes(4).toString("base64url")
    } catch (err) {
        console.log(`Error while generating code: ${err}`)
    }
}

const PORT = 3000
initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server running on PORT 3000");
    })
})
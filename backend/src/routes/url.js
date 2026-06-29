import QRCode from "qrcode";
import PDFDoc from "pdfkit";
import { Router } from 'express'
import {getNumClicks, incrementClicks, saveUrl} from "../controllers/url.js";
import crypto from "crypto";

const router = new Router()

router.post("/api/url", async (req, res) => {
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

router.get("/:code", async (req, res) => {
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

router.post("/:code/qr", async (req, res) => {
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

router.get("/:code/metrics", async (req, res) => {
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

export default router;
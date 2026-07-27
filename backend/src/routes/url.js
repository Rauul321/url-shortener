import QRCode from "qrcode";
import PDFDoc from "pdfkit";
import { Router } from 'express'
import {deleteUrl, getNumClicks, getUrl, getUserUrls, incrementClicks, saveUrl} from "../controllers/url.js";
import crypto from "crypto";
import rateLimit from "express-rate-limit";
import {urlLimiter} from "../middlewares/rate-limiter.js";
import jwt from "jsonwebtoken";
import {authenticateToken} from "../middlewares/auth-middleware.js";

const router = new Router()

router.post("/api/url", urlLimiter, async (req, res) => {
    const originalUrl = req.body.url
    if(!originalUrl.startsWith("https://") && !originalUrl.startsWith("http://")) {
        console.log("URL is invalid\n")
    }

    let userId = null;
    const authHeader = req.headers.authorization;

    if(authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        } catch(err) {
            console.error('Invalid token, URL created as anonymous:', err.message)
        }
    }
    const code = generateCode()

    await saveUrl(code, originalUrl, userId);

    const shortUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/${code}`;

    return res.json({
        code,
        shortUrl,
    });
});

router.get("/urls", authenticateToken, async (req, res) => {
    try {
        // Obtenemos el ID soportando tanto req.user.id como req.user.user_id
        const user_id = req.user?.id || req.user?.user_id;

        if (!user_id) {
            return res.status(400).json({
                error: "El token de autenticación no contiene un ID de usuario válido."
            });
        }

        const urls = await getUserUrls(user_id);

        return res.status(200).json({
            urls: urls || []
        });

    } catch (err) {
        console.error("Error en GET /urls:", err);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
});


router.get("/:code", async (req, res) => {
    try {
        const {code} = req.params;
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
        const shortLink = `${process.env.BASE_URL || 'http://localhost:3000'}/${code}`;
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



router.delete('/:code', authenticateToken, async (req, res) => {
    try {
        const { code } = req.params
        const result = await deleteUrl(code)

        if (!result) {
            return res.status(404).json({
                message: "The specified URL was not found."
            });
        }

        return res.status(200).json({
            message: "URL eliminada correctamente.",
            deletedCode: result.code
        });
    } catch (err) {
        console.error("Error al eliminar la URL:", err);
        return res.status(500).json({
            message: "Error interno del servidor al intentar borrar la URL."
        });
    }
})

function generateCode(){
    try {
        return crypto.randomBytes(4).toString("base64url")
    } catch (err) {
        console.log(`Error while generating code: ${err}`)
    }
}

export default router;
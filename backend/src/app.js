import express from 'express'
import crypto from 'crypto'
import { Pool } from 'pg'
import dotenv from 'dotenv'
import cors from 'cors'
import QRCode from 'qrcode'
import PDFDoc from 'pdfkit'
import 'dotenv/config'
import bcrypt from 'bcrypt'
import {z} from 'zod'
import jwt from 'jsonwebtoken'
import pool from './db.js'
import initDB from './db.js'
import authRouter from './routes/auth.js'
import urlRouter from './routes/url.js'



const app = express()

app.use(cors({
    origin: "http://localhost:5173", // El puerto exacto donde corre tu React
    methods: ["GET", "POST"],        // Los métodos que vas a permitir
    credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("URL Shortener API is working fine!")
});

app.use(authRouter);
app.use(urlRouter);

const PORT = 3000
initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server running on PORT 3000");
    })
})
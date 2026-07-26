import jwt from "jsonwebtoken";
import {z} from "zod";
import bcrypt from "bcrypt";
import { Router } from 'express';
import {registerUser, validateCredentials} from "../controllers/auth.js";
import {loginRateLimit} from "../middlewares/rate-limiter.js";

const router = new Router();

const signupSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    passwd: z.string()
})

const loginSchema = z.object({
    email:z.string().email()
})

const rateLimitMiddleware = (req, res, next) => loginRateLimit(req, res, next);

router.post("/login", rateLimitMiddleware, async (req, res) => {
    try {
        const { email, passwd } = req.body;
        const result = loginSchema.safeParse({email});
        if(result.error){
            return res.status(400).send(`Bad formatting on your credentials`)
        }
        const user = await validateCredentials(email, passwd);
        if(user) {
            console.log("Objeto user recuperado:", user);
            const token = jwt.sign({id: user.id, username: user.username, email: user.email}, process.env.JWT_SECRET, { expiresIn: '7d'})
            return res.status(200).json({token})
        } else {
            return res.status(401).send("Bad Credentials")
        }
    } catch (err) {
        return res.status(500).send("Internal Server Error")
    }
});

router.post("/signup", async (req, res) => {
    try {
        const { username, email, passwd } = req.body;
        const result = signupSchema.safeParse({username, email, passwd});
        if(result.error) {
            return res.status(400).send(`Bad formatting on your credentials`);
        }
        await registerUser(username, email, passwd);
        return res.status(200).send("You are now signed up, welcome to URL Shortener!")
    } catch (err) {
        console.log("Error in /signup:", err)
        return res.status(500).send("Internal Server Error");
    }
});

export default router;
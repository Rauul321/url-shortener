import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Convierte Bearer <TOKEN> en ['Bearer', '<TOKEN>'] y accede a la posición 1 del array (<TOKEN>)

    if(!token) {
        return res.status(401).json({message: "Denied access. Session token is invalid."});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({message: 'Invalid or expired token'})
    }
}
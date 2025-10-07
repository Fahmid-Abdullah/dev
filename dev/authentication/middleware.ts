import { Response, Request, NextFunction } from "express"
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
    userId?: string;
}

function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: "Access denied." });
    }

    try {
        const decoded = jwt.verify(token, "43ewdsfc453") as { userId: string };
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(400).json({ message: `Invalid token: ${err}` });
    }
}

export default verifyToken;
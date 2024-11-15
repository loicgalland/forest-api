import {NextFunction, Request, Response} from "express";
import jwt, {TokenExpiredError} from "jsonwebtoken";
import {AdminPayload} from "../dto/Admin.dto";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY!;

interface RequestWithUser extends Request {
    user?: AdminPayload;
}

export const isAdminAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = jwt.verify(token, SECRET_KEY) as AdminPayload;

        if (user && user.role === "admin") {
            req.user = user;
            return next();
        }

        res.status(403).json({ message: 'User not authorized' });
    } catch(error) {
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({ message: 'Unauthorized: Token expired' });
        }
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
}
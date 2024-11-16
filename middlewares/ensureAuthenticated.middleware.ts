import {NextFunction, Request, Response} from "express";
import {TokenExpiredError} from "jsonwebtoken";
import {decodeJwt} from "../utility";


export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = decodeJwt(token)
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({ message: 'Unauthorized: Token expired' });
        }
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
}
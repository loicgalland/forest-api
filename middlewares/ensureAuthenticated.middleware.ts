import {NextFunction, Request, Response} from "express";
import {SECRET_KEY} from "../config";
import jwt, {TokenExpiredError} from "jsonwebtoken";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = jwt.verify(token, SECRET_KEY);
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res.jsonError("Token expired", 401);
        }
        next(error);
    }
}
import {NextFunction, Request, Response} from "express";
import jwt, {TokenExpiredError} from "jsonwebtoken";
import {AdminPayload} from "../dto/Admin.dto";
import {SECRET_KEY} from "../config";

export const isAdminAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.jsonError('User not authorized', 403);
        }

        const user = jwt.verify(token, SECRET_KEY) as AdminPayload;

        if (user.role === "admin") {
            req.user = user;
            return next();
        }

        res.jsonError('User not authorized', 403);
    } catch(error) {
        if(error instanceof TokenExpiredError) {
            return res.jsonError("Token expired", 401)
        }
        next(error)
    }
}
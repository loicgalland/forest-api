import {NextFunction, Request, Response} from "express";
import {isValidSignature} from "../utility";
import {TokenExpiredError} from "jsonwebtoken";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    try {
        const isValid = isValidSignature(req)

        if (isValid) {
            return next()
        }
        res.jsonError('User not authorized', 403)
    } catch(error) {
        if(error instanceof TokenExpiredError) {
            return res.jsonError("Token expired", 401)
        }
        next(error)
    }
}
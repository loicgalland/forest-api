import {NextFunction, Request, Response} from "express";
import {isValidSignature} from "../utility";
import {TokenExpiredError} from "jsonwebtoken";
import {AdminPayload} from "../dto/Admin.dto";

export const isAdminAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    try {
        const isValid = isValidSignature(req)
        const user = <AdminPayload>req.user

        if (isValid && user.role === "admin") {
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
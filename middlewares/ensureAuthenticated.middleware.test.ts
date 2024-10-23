import {Request, Response, NextFunction} from "express";
import {isAuthenticated} from "./ensureAuthenticated.middleware";
import jwt from "jsonwebtoken";
import {SECRET_KEY} from "../config";


describe('EnsureAuthenticatedMiddleware', () => {
    describe('Happy path', () => {
        let req: Partial<Request>;
        let res: Partial<Response>;
        let next: NextFunction;

        beforeEach(() => {
            req = {
                cookies: {}
            };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            next = jest.fn();
        });
        it('Should return 401 if no token', () => {
            isAuthenticated(req as Request, res as Response, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
            expect(next).not.toHaveBeenCalled();
        })
        it('Should authenticate the user and call next if a valid token is provided', () => {
            const token = jwt.sign({ id: "123", name: "John Doe" }, SECRET_KEY);
            req.cookies.token = token;

            isAuthenticated(req as Request, res as Response, next);

            expect(next).toHaveBeenCalled();
            expect(req.user).toEqual(expect.objectContaining({ id: "123", name: "John Doe" }));
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    })
})
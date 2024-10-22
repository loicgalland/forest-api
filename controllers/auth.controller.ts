import {Request, Response, NextFunction} from "express";
import {CreateUserInputs, LoginUserInputs} from "../dto/user.dto";
import {User} from "../database/models/User.model";
import {generateSalt, generateSignature, hashPassword, isValidatedPassword} from "../utility";
import jwt from "jsonwebtoken";
import {SECRET_KEY} from "../config";
import {AuthPayload} from "../dto/Auth.dto";


export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = <CreateUserInputs>req.body;
        const existingUser = await User.findOne({email: body.email})
        if(existingUser) {
            return res.jsonError('This user already exist', 409)
        }

        const salt = await generateSalt();
        const hashedPassword = await hashPassword(body.password, salt);

        const newUser = await User.create({
            ...body, salt, password: hashedPassword
        })

        await newUser.save();
        return res.jsonSuccess(newUser, 201)

    }catch (error) {
        next(error)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = <LoginUserInputs>req.body;
        const existingUser = await User.findOne({ email }).exec();

        if (!existingUser) {
            return res.jsonError('Wrong credentials', 403);
        }

        const isValidPassword = await isValidatedPassword(password, existingUser.password, existingUser.salt);

        if (!isValidPassword) {
            return res.jsonError('Wrong credentials', 403);
        }

        const token = generateSignature({
            _id: existingUser._id as string,
            email: existingUser.email,
            role: existingUser.role,
        });

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        return res.jsonSuccess({ message: "Login successful" }, 200);
    } catch (error) {
        next(error);
    }
};

export const getUserRole = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY) as AuthPayload;
        res.json({ role: decoded.role });
    } catch (error) {
        next(error)
    }
}
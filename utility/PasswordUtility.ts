import  bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import {SECRET_KEY} from "../config";
import {Request} from "express";
import {AuthPayload} from "../dto/Auth.dto";

export const generateSalt =  () => {
    return  bcrypt.genSalt()
}

export const hashPassword = (password: string, salt: string) => {
    return bcrypt.hash(password, salt)
}

export const isValidatedPassword = async (enteredPassword: string, savedPassword: string, salt: string) => {
    return await hashPassword(enteredPassword, salt) === savedPassword
}

export const generateSignature = (payload: AuthPayload) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' })
}

export const isValidSignature = (req: Request) => {
    const signature = req.get('Authorization')
    if (signature) {
        const token = signature.split(' ')[1]
        req.user = jwt.verify(token, SECRET_KEY) as AuthPayload
        return true
    }
    return false
}
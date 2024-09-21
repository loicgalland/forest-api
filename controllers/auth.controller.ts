import {Request, Response, NextFunction} from "express";
import {CreateUserInputs, LoginUserInputs} from "../dto/user.dto";
import {User} from "../database/models/User.model";
import {generateSalt, generateSignature, hashPassword, isValidatedPassword} from "../utility";


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
        const {email, password} = <LoginUserInputs>req.body
        const existingUser = await User.findOne({email}).exec()

        if(existingUser){
            const isValidPassword = await isValidatedPassword(req.body.password, existingUser.password ,existingUser.salt)
            if(isValidPassword){
                const signature = generateSignature({
                    _id: existingUser._id as string,
                    email: existingUser.email,
                    role: existingUser.role,
                })
                res.jsonSuccess(signature, 200)
            }
        }
        return res.jsonError('Wrong credentials', 403)

    }catch (error) {
        next(error)
    }
}
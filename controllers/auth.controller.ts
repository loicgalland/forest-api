import {Request, Response, NextFunction} from "express";
import {CreateUserInputs} from "../dto/user.dto";
import {User} from "../database/models/User.model";
import {generateSalt, hashPassword} from "../utility";


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
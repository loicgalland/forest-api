import {NextFunction, Request, Response} from 'express';
import {File} from "../database/models/File.model";
import {ValidatorRequest} from "../utility/validate-request";
import {CreateFileInputs} from "../dto/file.dto";


export const createFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body as CreateFileInputs;
        const {errors, input} = await ValidatorRequest(CreateFileInputs, body);

        if(errors) {
            return res.jsonError(errors, 400)
        };

        const newFile = await File.create({...input})
        await newFile.save();
        return res.jsonSuccess(newFile, 201)
    } catch (error) {
        next(error)
    }
}

export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    try {
        await File.findById(id);
        return res.jsonSuccess('Bed delete', 404)

    } catch (error) {
        next(error)
    }
}

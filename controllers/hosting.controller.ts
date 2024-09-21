import {NextFunction, Request, Response} from 'express';
import {Equipment} from "../database/models";
import {CreateEquipmentInputs} from "../dto/equipment.dto";
import {CreateHostingInputs} from "../dto/hosting.dto";
import {Hosting} from "../database/models/Hosting.model";


export const createHosting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = <CreateHostingInputs>req.body;
        const existingHosting = await Hosting.findOne({name: body.name});
        if (existingHosting) {
            return res.jsonError('This hosting already exist', 409)
        }

        const newHosting = new Hosting({...body})
        await newHosting.save();
        return res.jsonSuccess(newHosting, 201)
    } catch (error) {
        next(error)
    }
}

export const getAllHosting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hostings = await Hosting.find({});

        if (hostings.length) return res.jsonSuccess(hostings, 200)
        return res.jsonError('No hosting found', 404)

    } catch (error) {
        next(error)
    }
}

export const updateHosting = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const {name, description, isSpotlight} = req.body;
    try {
        const hosting = await Hosting.findById(id);
        if (!hosting) {
            return res.jsonError('Equipment not found', 404)
        }
        if (name !== undefined) hosting.name = name;
        if (description !== undefined) hosting.description = description;
        if (isSpotlight !== undefined) hosting.isSpotlight = isSpotlight;
        const hostingSaved = await hosting.save();
        return res.jsonSuccess(hostingSaved, 200)
    } catch (error) {
        next(error)
    }
}

export const deleteHosting = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    try {
        await Hosting.findById(id);
        return res.jsonSuccess('Hosting delete', 404)

    } catch (error) {
        next(error)
    }
}

import {NextFunction, Request, Response} from 'express';
import {Equipment} from "../database/models";
import {CreateEquipmentInputs} from "../dto/equipment.dto";


export const createEquipment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = <CreateEquipmentInputs>req.body;
        const existingEquipment = await Equipment.findOne({name: body.name});
        if (existingEquipment) {
            return res.jsonError('This equipment already exist', 409)
        }

        const newEquipment = new Equipment({...body})
        await newEquipment.save();
        return res.jsonSuccess(newEquipment, 201)
    } catch (error) {
        next(error)
    }
}

export const getAllEquipments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const equipments = await Equipment.find({});

        if (equipments.length) return res.jsonSuccess(equipments, 200)
        return res.jsonError('No equipments found', 404)

    } catch (error) {
        next(error)
    }
}

export const updateEquipment = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const {name, description} = req.body;
    try {
        const equipment = await Equipment.findById(id);
        if (!equipment) {
            return res.jsonError('Equipment not found', 404)
        }
        if (name !== undefined) equipment.name = name;
        if (description !== undefined) equipment.description = description;
        const equipmentSaved = await equipment.save();
        return res.jsonSuccess(equipmentSaved, 200)
    } catch (error) {
        next(error)
    }
}

export const deleteEquipment = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    try {
        await Equipment.findById(id);
        return res.jsonSuccess('Equipment delete', 404)

    } catch (error) {
        next(error)
    }
}

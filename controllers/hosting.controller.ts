import {NextFunction, Request, Response} from 'express';
import {CreateHostingInputs} from "../dto/hosting.dto";
import {Bed, Hosting} from "../database/models";


export const createHosting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = <CreateHostingInputs>req.body;
        const existingHosting = await Hosting.findOne({name: body.name});
        if (existingHosting) {
            return res.jsonError('This hosting already exist', 409)
        }
        const beds = await Promise.all(body.beds.map(async (bed) => {
            const { bedId, quantity } = bed;
            const existingBed = await Bed.findById(bedId);

            if (!existingBed) {
                return res.status(404).json({ error: `Bed with ID ${bedId} not found` });
            }

            return {
                bed: bedId,
                quantity
            };
        }));

        const newHosting = new Hosting({
            ...body,
            beds
        });
        await newHosting.save();
        return res.jsonSuccess(newHosting, 201)
    } catch (error) {
        next(error)
    }
}

export const getAllHosting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hostings = await Hosting.find({}).populate({
            path: 'beds',  // Remplir le champ beds avec les données de HostingBed
            populate: {
                path: 'bed',  // Remplir aussi le champ bed dans HostingBed pour avoir les détails du lit
                model: 'Bed'  // Spécifier le modèle Bed pour la population
            }
        });

        if (hostings.length) return res.jsonSuccess(hostings, 200)
        return res.jsonError('No hosting found', 404)

    } catch (error) {
        next(error)
    }
}

export const updateHosting = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const {name, description, isSpotlight, beds} = req.body;
    try {
        const hosting = await Hosting.findById(id);
        if (!hosting) {
            return res.jsonError('Equipment not found', 404)
        }
        if (name !== undefined) hosting.name = name;
        if (description !== undefined) hosting.description = description;
        if (isSpotlight !== undefined) hosting.isSpotlight = isSpotlight;
        if(beds && beds.length) hosting.beds = beds

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

import {NextFunction, Request, Response} from 'express';
import {CreateHostingInputs} from "../dto/hosting.dto";
import {Bed, Equipment, Hosting} from "../database/models";
import {ValidatorRequest} from "../utility/validate-request";
import {calculateCapacity} from "../services/hosting.service";


export const createHosting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body)
        const body = req.body as CreateHostingInputs;
        const {errors, input} = await ValidatorRequest(CreateHostingInputs, body);

        if(errors) {
            return res.jsonError(errors, 400)
        };

        const existingHosting = await Hosting.findOne({name: input.name});
        if (existingHosting) {
            return res.jsonError('This hosting already exist', 409)
        }
        const files = req.files as [Express.Multer.File] | undefined;
        const images = files ? files.map(file => file.filename) : [];

        const beds = await Promise.all(input.beds.map(async (bed) => {
            const { bedId, quantity } = bed;
            const existingBed = await Bed.findById(bedId);

            if (!existingBed) {
                return res.status(404).json({ error: `Bed with ID ${bedId} not found` });
            }

            return {
                bed: bedId,
                quantity
            };
        }))

        const totalCapacity = await calculateCapacity(beds)



        const newHosting = new Hosting({
            ...input,
            beds,
            images,
            capacity: totalCapacity,
        });



        await newHosting.save();
        return res.jsonSuccess(newHosting, 201)
    } catch (error) {
        next(error)
    }
}

export const getAllHosting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hostings = await Hosting.find({visible: true})
            .populate({
                path: 'beds',
                populate: {
                    path: 'bed',
                    model: 'Bed'
                }
            })
            .populate( 'equipments')
            .lean();

        if (hostings.length) return res.jsonSuccess(hostings, 200)
        return res.jsonError('No hosting found', 404)

    } catch (error) {
        next(error)
    }
}

export const getOneHosting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const hosting = await Hosting.findById(id)
            .populate({
                path: 'beds',
                populate: {
                    path: 'bed',
                    model: 'Bed'
                }
            })
            .populate('equipments')
            .lean();

        if (hosting) return res.jsonSuccess(hosting, 200)
        return res.jsonError('No hosting found', 404)

    } catch (error){
        next(error)
    }
}

export const updateHosting = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const {name, description, isSpotlight, beds, equipments} = req.body;
    try {
        const hosting = await Hosting.findById(id);
        if (!hosting) {
            return res.jsonError('Equipment not found', 404)
        }
        if (name !== undefined) hosting.name = name;
        if (description !== undefined) hosting.description = description;
        if (isSpotlight !== undefined) hosting.isSpotlight = isSpotlight;
        if(beds && beds.length) hosting.beds = beds
        if(equipments && equipments.length) hosting.equipments = equipments

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

export const getSpotlightHosting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hostings = await Hosting.find({ visible: true, isSpotlight: true}).populate({
            path: 'beds',
            populate: {
                path: 'bed',
                model: 'Bed'
            }
        })
            .populate('equipments')
            .lean();


        if (hostings.length) return res.jsonSuccess(hostings, 200)
        return res.jsonError('No hosting found', 404)

    } catch (error) {
        next(error)
    }
}

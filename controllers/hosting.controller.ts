import {NextFunction, Request, Response} from 'express';
import {CreateHostingInputs} from "../dto/hosting.dto";
import {Bed, Equipment, Hosting} from "../database/models";
import {Price} from "../database/models/Price.model";


export const createHosting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = <CreateHostingInputs>req.body;
        const existingHosting = await Hosting.findOne({name: body.name});
        if (existingHosting) {
            return res.jsonError('This hosting already exist', 409)
        }
        const files = req.files as [Express.Multer.File] | undefined;
        const images = files ? files.map(file => file.filename) : [];

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

        const equipments = await Promise.all(body.equipments.map(async (equipment) => {
            const { equipmentId, quantity } = equipment;
            const existingEquipment = await Equipment.findById(equipmentId);

            if (!existingEquipment) {
                return res.status(404).json({ error: `Equipment with ID ${equipmentId} not found` });
            }

            return {
                equipment: equipmentId,
                quantity
            };
        }));

        const prices = await Promise.all(body.prices.map(async (price) => {
            const { htAmount, startDate, endDate } = price;

            if (!htAmount || !startDate || !endDate) {
                throw new Error("Price validation failed: htAmount, startDate, and endDate are required.");
            }

            const newPrice = new Price({
                htAmount,
                startDate,
                endDate
            });

            await newPrice.save();
            return { price: newPrice };
        }));

        const newHosting = new Hosting({
            ...body,
            beds,
            equipments,
            prices,
            images,
        });
        await newHosting.save();
        return res.jsonSuccess(newHosting, 201)
    } catch (error) {
        next(error)
    }
}

export const getAllHosting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hostings = await Hosting.find({})
            .populate({
                path: 'beds',
                populate: {
                    path: 'bed',
                    model: 'Bed'
                }
            })
            .populate({
                path: 'equipments',
                populate: {
                    path: 'equipment',
                    model: 'Equipment'
                    }
            })
            .populate({
                path: 'prices',
                populate: {
                    path: 'price',
                    model: 'Price'
                }
            })
            .lean();

        if (hostings.length) return res.jsonSuccess(hostings, 200)
        return res.jsonError('No hosting found', 404)

    } catch (error) {
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
        const hostings = await Hosting.find({ isSpotlight: true}).populate({
            path: 'beds',
            populate: {
                path: 'bed',
                model: 'Bed'
            }
        })
            .populate({
                path: 'equipments',
                populate: {
                    path: 'equipment',
                    model: 'Equipment'
                }
            })
            .populate({
                path: 'prices',
                populate: {
                    path: 'price',
                    model: 'Price'
                }
            })
            .lean();
        

        if (hostings.length) return res.jsonSuccess(hostings, 200)
        return res.jsonError('No hosting found', 404)

    } catch (error) {
        next(error)
    }
}

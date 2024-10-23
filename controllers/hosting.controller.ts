import {CreateHostingInputs} from "../dto/hosting.dto";
import {Bed, BedArray, Hosting} from "../database/models";
import {ValidatorRequest} from "../utility/validate-request";
import {calculateCapacity} from "../services/hosting.service";
import mongoose from "mongoose";
import {Request, Response, NextFunction} from "express";
import {File} from "../database/models/File.model";


interface Bed {
    bedId: mongoose.Types.ObjectId;
    quantity: number;
}

export const createHosting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;

        body.price = parseFloat(body.price);
        body.visible = body.visible === 'true';
        body.isSpotlight = body.isSpotlight === 'true';
        body.beds = JSON.parse(body.beds);

        body.equipments = JSON.parse(body.equipments).map((equipmentId: string) =>
            new mongoose.Types.ObjectId(equipmentId)
        );

        const {errors, input} = await ValidatorRequest(CreateHostingInputs, body);

        if (errors) {
            return res.jsonError(errors, 400);
        }

        const existingHosting = await Hosting.findOne({ name: input.name });
        if (existingHosting) {
            return res.jsonError('This hosting already exists', 409);
        }

        let imageIds: mongoose.Types.ObjectId[] = []

        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                const newFile = new File({
                    originalName: file.originalname,
                    path: file.path,
                });

                const savedFile = await newFile.save();
                imageIds.push(savedFile._id as mongoose.Types.ObjectId);
            }
        }

        const beds = await Promise.all(input.beds.map(async (bed) => {
            const { bedId, quantity } = bed;
            const existingBed = await Bed.findById(bedId);

            if (!existingBed) {
                return res.status(404).json({ error: `Bed with ID ${bedId} not found` });
            }

            return {
                bed: bedId,
                quantity,
            };
        }));

        const totalCapacity = await calculateCapacity(beds);

        const newHosting = new Hosting({
            ...input,
            beds,
            images: imageIds,
            capacity: totalCapacity,
        });

        await newHosting.save();
        return res.jsonSuccess(newHosting, 201);
    } catch (error) {
        next(error);
    }
}

export const getAllVisibleHosting = async (req: Request, res: Response, next: NextFunction) => {
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
            .populate({
                path: 'images'
            })
            .lean();

        if (hostings.length) return res.jsonSuccess(hostings, 200)
        return res.jsonSuccess('No hosting found', 200)

    } catch (error) {
        next(error)
    }
}

export const getAllHosting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hostings = await Hosting.find()
            .populate({
                path: 'beds',
                populate: {
                    path: 'bed',
                    model: 'Bed'
                }
            })
            .populate( 'equipments')
            .populate({
                path: 'images'
            })
            .lean();

        if (hostings.length) return res.jsonSuccess(hostings, 200)
        return res.jsonSuccess('No hosting found', 200)

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

            .lean()
            .populate({
                path: 'images'
            });

        if (hosting) return res.jsonSuccess(hosting, 200)
        return res.jsonError('No hosting found', 404)

    } catch (error){
        next(error)
    }
}

export const updateHosting = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const {name, description, visible, isSpotlight, price, equipments, imageToDelete,} = req.body;

    try {
        const hosting = await Hosting.findById(id);
        if (!hosting) {
            return res.jsonError('Equipment not found', 404)
        }
        if (name !== undefined) hosting.name = name;
        if (description !== undefined) hosting.description = description;
        if (visible !== undefined) hosting.visible = visible;
        if (isSpotlight !== undefined) hosting.isSpotlight = isSpotlight;
        if(price !== undefined) hosting.price = price;


        const beds: BedArray[] = [];

        req.body.beds.forEach((bed) => {
            const bedId = bed.bedId;
            const quantity = bed.quantity;

            if (bedId && quantity) {
                const existingBedIndex = hosting.beds.findIndex(b => b.bed.equals(new mongoose.Types.ObjectId(bedId)));
               if(Number(quantity) === 0){
                   hosting.beds.splice(existingBedIndex, 1);
               }
               else{
                   if (existingBedIndex !== -1) {
                       hosting.beds[existingBedIndex].quantity = parseInt(quantity, 10);
                   } else {
                       beds.push({
                           bed: new mongoose.Types.ObjectId(bedId),
                           quantity: parseInt(quantity, 10)
                       });
                   }
               }
            }

        })

        let imageIds: mongoose.Types.ObjectId[] = [];

        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                const newFile = new File({
                    originalName: file.originalname,
                    path: file.path,
                });

                const savedFile = await newFile.save();
                imageIds.push(savedFile._id as mongoose.Types.ObjectId);
            }
        }

        hosting.images = [...hosting.images, ...imageIds];

        if (imageToDelete) {
            hosting.images = hosting.images.filter(imageId => !imageToDelete.includes(imageId.toString()));
        }

        if (beds.length) {
            hosting.beds.push(...beds);
        }

        if(equipments && equipments.length) hosting.equipments = equipments

        if(hosting.beds && hosting.beds.length) hosting.capacity = await calculateCapacity(hosting.beds);


        const hostingSaved = await hosting.save();
        return res.jsonSuccess(hostingSaved, 200)
    } catch (error) {
        next(error)
    }
}

export const deleteHosting = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    try {
        const hosting = await Hosting.findById(id);

        if (!hosting) {
            return res.jsonError('Hosting not found', 404);
        }

        if (hosting.images && hosting.images.length > 0) {
            await File.deleteMany({ _id: { $in: hosting.images } });
        }

        await Hosting.findByIdAndDelete(id);
        return res.jsonSuccess('Hosting delete', 200)

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
            .populate({
                path: 'images'
            })
            .lean();


        if (hostings.length) return res.jsonSuccess(hostings, 200)
        return res.jsonSuccess('No hosting found', 200)

    } catch (error) {
        next(error)
    }
}

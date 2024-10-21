import {Request, Response, NextFunction} from "express";
import {Event} from "../database/models/Event.model";
import {File} from "../database/models/File.model";
import {ValidatorRequest} from "../utility/validate-request";
import mongoose from "mongoose";
import {CreateEventInputs} from "../dto/event.dto";


export const getAllEvents = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await Event.find()
            .populate({
                path: 'images'
            })

        if(events.length) return res.jsonSuccess(events, 200)
        return res.jsonError('No events found', 404)
    } catch (error) {
        next(error)
    }
}

export const getAllVisibleEvents = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await Event.find({visible: true})
            .populate({
                path: 'images'
            })

        if(events.length) return res.jsonSuccess(events, 200)
        return res.jsonError('No events found', 404)
    } catch (error) {
        next(error)
    }
}


export const getOneEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const event = await Event.findById(id)
            .populate({
                path: 'images'
            })

        if(event) return res.jsonSuccess(event, 200)
        return res.jsonError('No event found', 404)
    } catch (error) {
        next(error)
    }
}

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const body = req.body;
        body.price = parseFloat(body.price);
        body.visible = body.visible === 'true';
        body.date = new Date(req.body.date);


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

        const {errors, input} = await ValidatorRequest(CreateEventInputs, body);

        if (errors) {
            return res.jsonError(errors, 400);
        }

        const files = req.files as [Express.Multer.File] | undefined;
        const images = files ? files.map(file => file.filename) : [];

        const newEvent = await Event.create({
            ...input,
            images: imageIds,
        });
        await newEvent.save();
        return res.jsonSuccess(newEvent, 201)

    } catch (error) {
        next(error)
    }
}

export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const {name, description, visible, price, date} = req.body;
    try{
        const event = await Event.findById(id);

        if (!event) return res.jsonError('Event not found', 404)

        if (name !== undefined) event.name = name;
        if (description !== undefined) event.description = description;
        if (visible !== undefined) event.visible = visible;
        if(price !== undefined) event.price = price;
        if(date !== undefined) event.date = date;

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

        event.images = [...event.images, ...imageIds];

        const eventSaved = await event.save();
        return res.jsonSuccess(eventSaved, 200)

    } catch (error){
        next(error)
    }
}

export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    try {
        const event = await Event.findById(id);

        if(!event) return res.jsonError('Event not found', 404)

        if(event.images && event.images.length > 0){
            await File.deleteMany({ _id: { $in: event.images } });
        }

        await Event.findByIdAndDelete(id);
        return res.jsonSuccess('Event deleted', 200)

    } catch (error) {
        next(error)
    }
}


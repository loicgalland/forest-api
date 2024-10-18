import {Request, Response, NextFunction} from "express";
import {Activity} from "../database/models/Activities.model";
import {ValidatorRequest} from "../utility/validate-request";
import {CreateHostingInputs} from "../dto/hosting.dto";


export const getAllActivities = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const activities = await Activity.find({visible: true})

        if(activities.length) return res.jsonSuccess(activities, 200)
        return res.jsonError('No activities found', 404)
    } catch (error) {
        next(error)
    }
}

export const getAllSpotlightActivities = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const activities = await Activity.find({visible: true, isSpotlight: true})
        if(activities.length) return res.jsonSuccess(activities, 200)
        return res.jsonError('No activities found', 404)
    } catch (error){
        next(error)
    }
}

export const getOneActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const activity = await Activity.findById(id)

        if(activity) return res.jsonSuccess(activity, 200)
        return res.jsonError('No activity found', 404)
    } catch (error) {
        next(error)
    }
}

export const createActivity = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const body = req.body;
        body.price = parseFloat(body.price);
        body.visible = body.visible === 'true';
        body.isSpotlight = body.isSpotlight === 'true';

        const {errors, input} = await ValidatorRequest(CreateHostingInputs, body);

        if (errors) {
            return res.jsonError(errors, 400);
        }

        const files = req.files as [Express.Multer.File] | undefined;
        const images = files ? files.map(file => file.filename) : [];

        const newActivity = await Activity.create({
            ...input,
            images
        });
        await newActivity.save();
        return res.jsonSuccess(newActivity, 201)

    } catch (error) {
        next(error)
    }
}

export const updateActivity = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const {name, description, visible, isSpotlight, price} = req.body;
    try{
        const activity = await Activity.findById(id);

        if (!activity) return res.jsonError('Activity not found', 404)

        if (name !== undefined) activity.name = name;
        if (description !== undefined) activity.description = description;
        if (visible !== undefined) activity.visible = visible;
        if (isSpotlight !== undefined) activity.isSpotlight = isSpotlight;
        if(price !== undefined) activity.price = price;

        const activitySaved = await activity.save();
        return res.jsonSuccess(activitySaved, 200)

    } catch (error){
        next(error)
    }
}

export const deleteActivity = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    try {
        await Activity.findByIdAndDelete(id);
        return res.jsonSuccess('Activity deleted', 200)

    } catch (error) {
        next(error)
    }
}


import {Request, Response, NextFunction} from "express";
import {Activity, ActivityDoc} from "../database/models";
import {File} from "../database/models";
import {ValidatorRequest} from "../utility";
import mongoose from "mongoose";
import {CreateActivityInputs} from "../dto/activity.dto";

export const getAllActivities = async(req: Request, res: Response, next: NextFunction) => {
    const { fullAccess, spotlight } = req.query;
    let activities: ActivityDoc[] = [];
    try {
        if(fullAccess === 'true'){
            activities = await Activity.find()
                .populate({
                    path: 'images'
                })
        } else if(spotlight === 'true'){
            activities = await Activity.find({visible: true, isSpotlight: true})
                .populate({
                    path: 'images'
                })
        } else {
            activities = await Activity.find({visible: true})
                .populate({
                    path: 'images'
                })
        }

        if(activities.length) return res.jsonSuccess(activities, 200)
        return res.jsonSuccess('No activities found', 200)
    } catch (error) {
        next(error)
    }
}

export const getOneActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const activity = await Activity.findById(id)
            .populate({
                path: 'images'
            })

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

        const {errors, input} = await ValidatorRequest(CreateActivityInputs, body);

        if (errors) {
            return res.jsonError(errors, 400);
        }

        const files = req.files as [Express.Multer.File] | undefined;
        const images = files ? files.map(file => file.filename) : [];

        const newActivity = await Activity.create({
            ...input,
            images: imageIds,
        });
        await newActivity.save();
        return res.jsonSuccess(newActivity, 201)

    } catch (error) {
        next(error)
    }
}

export const updateActivity = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const {name, description, visible, isSpotlight, price, imageToDelete, image} = req.body;
    try{
        const activity = await Activity.findById(id);

        if (!activity) return res.jsonError('Activity not found', 404)

        if (name !== undefined) activity.name = name;
        if (description !== undefined) activity.description = description;
        if (visible !== undefined) activity.visible = visible;
        if (isSpotlight !== undefined) activity.isSpotlight = isSpotlight;
        if(price !== undefined) activity.price = price;

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

        activity.images = [...activity.images, ...imageIds];

        if (imageToDelete) {
            activity.images = activity.images.filter(imageId => !imageToDelete.includes(imageId.toString()));
        }

        const activitySaved = await activity.save();
        return res.jsonSuccess(activitySaved, 200)

    } catch (error){
        next(error)
    }
}

export const deleteActivity = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    try {
        const activity = await Activity.findById(id);

        if(!activity) return res.jsonError('Activity not found', 404)

        if(activity.images && activity.images.length > 0){
            await File.deleteMany({ _id: { $in: activity.images } });
        }

        await Activity.findByIdAndDelete(id);
        return res.jsonSuccess('Activity deleted', 200)

    } catch (error) {
        next(error)
    }
}


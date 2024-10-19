import express from "express";
import {
    createActivity, deleteActivity,
    getAllActivities,
    getAllSpotlightActivities,
    getOneActivity, updateActivity
} from "../controllers/activity.controller";
import {isAdminAuthenticated} from "../middlewares/ensureAdminAuthenticated.middleware";
import {uploadImagesMiddleware} from "../middlewares/uploadImage.middleware";

const router = express.Router();
router.get("/", getAllActivities);
router.get("/spotlight", getAllSpotlightActivities);
router.get("/:id", getOneActivity);
router.use(isAdminAuthenticated);
router.post('/', uploadImagesMiddleware, createActivity)
router.patch('/:id', uploadImagesMiddleware, updateActivity);
router.delete("/:id", deleteActivity);


export { router as ActivityRoutes }
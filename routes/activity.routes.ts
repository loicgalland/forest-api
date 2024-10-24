import express from "express";
import {
    createActivity, deleteActivity,
    getAllActivities,
    getOneActivity, updateActivity
} from "../controllers";
import {isAdminAuthenticated} from "../middlewares";
import {uploadImagesMiddleware} from "../middlewares";

const router = express.Router();
router.get("/", getAllActivities);
router.get("/:id", getOneActivity);
router.use(isAdminAuthenticated);
router.post('/', uploadImagesMiddleware, createActivity)
router.patch('/:id', uploadImagesMiddleware, updateActivity);
router.delete("/:id", deleteActivity);


export { router as ActivityRoutes }
import express from "express";
import {isAdminAuthenticated} from "../middlewares/ensureAdminAuthenticated.middleware";
import {uploadImagesMiddleware} from "../middlewares/uploadImage.middleware";
import {createEvent, deleteEvent, getAllEvents, getOneEvent, updateEvent} from "../controllers/event.controller";

const router = express.Router();
router.get("/", getAllEvents);
router.get("/:id", getOneEvent);
router.use(isAdminAuthenticated);
router.post('/', uploadImagesMiddleware, createEvent)
router.patch('/:id', uploadImagesMiddleware, updateEvent);
router.delete("/:id", deleteEvent);


export { router as EventRoutes }
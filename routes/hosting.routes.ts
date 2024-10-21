import express from "express";
import {
    createHosting,
    deleteHosting,
    getAllHosting, getAllVisibleHosting,
    getOneHosting,
    getSpotlightHosting,
    updateHosting
} from "../controllers";
import {isAdminAuthenticated} from "../middlewares/ensureAdminAuthenticated.middleware";
import {uploadImagesMiddleware} from "../middlewares/uploadImage.middleware";


const router = express.Router();
router.get("/", getAllHosting);
router.get("/visible", getAllVisibleHosting);
router.get("/spotlight", getSpotlightHosting);
router.get("/:id", getOneHosting);
router.use(isAdminAuthenticated);
router.post("/", uploadImagesMiddleware, createHosting);
router.patch('/:id', uploadImagesMiddleware, updateHosting);
router.delete("/:id", deleteHosting);


export { router as HostingRoutes }
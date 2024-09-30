import express from "express";
import {
    createHosting,
    deleteHosting,
    getAllHosting,
    getOneHosting,
    getSpotlightHosting,
    updateHosting
} from "../controllers";
import {isAdminAuthenticated} from "../middlewares/ensureAdminAuthenticated.middleware";
import {uploadImagesMiddleware} from "../middlewares/uploadImage.middleware";


const router = express.Router();
router.get("/", getAllHosting);
router.get("/spotlight", getSpotlightHosting);
router.get("/:id", getOneHosting);
router.use(isAdminAuthenticated);
router.post("/", createHosting, uploadImagesMiddleware);
router.patch('/:id', updateHosting);
router.delete("/:id", deleteHosting);


export { router as HostingRoutes }
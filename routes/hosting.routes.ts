import express from "express";
import {
    createHosting,
    deleteHosting,
    getAllHosting,
    getOneHosting,
    updateHosting
} from "../controllers";
import {isAdminAuthenticated} from "../middlewares";
import {uploadImagesMiddleware} from "../middlewares";


const router = express.Router();
router.get("/", getAllHosting);
router.get("/:id", getOneHosting);
router.use(isAdminAuthenticated);
router.post("/", uploadImagesMiddleware, createHosting);
router.patch('/:id', uploadImagesMiddleware, updateHosting);
router.delete("/:id", deleteHosting);


export { router as HostingRoutes }
import express from "express";
import {createHosting, deleteHosting, getAllHosting, updateHosting} from "../controllers";
import {isAuthenticated} from "../middlewares";


const router = express.Router();
router.get("/", getAllHosting);
router.use(isAuthenticated);
router.post("/", createHosting);
router.patch('/:id', updateHosting);
router.delete("/:id", deleteHosting);


export { router as HostingRoutes }
import express from "express";
import {createHosting, deleteHosting, getAllHosting, updateHosting} from "../controllers";
import {isAdminAuthenticated} from "../middlewares/ensureAdminAuthenticated.middleware";


const router = express.Router();
router.get("/", getAllHosting);
router.use(isAdminAuthenticated);
router.post("/", createHosting);
router.patch('/:id', updateHosting);
router.delete("/:id", deleteHosting);


export { router as HostingRoutes }
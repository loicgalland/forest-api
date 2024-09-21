import express from "express";
import {createBed, deleteBed, getAllBeds, updateBed} from "../controllers";
import {isAdminAuthenticated} from "../middlewares/ensureAdminAuthenticated.middleware";


const router = express.Router();

router.get("/", getAllBeds);

router.use(isAdminAuthenticated);
router.post("/", createBed);
router.patch('/:id', updateBed);
router.delete("/:id", deleteBed);


export { router as BedRoutes }
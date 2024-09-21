import express from "express";
import {createBed, deleteBed, getAllBeds, updateBed} from "../controllers";
import {isAuthenticated} from "../middlewares";


const router = express.Router();

router.get("/", getAllBeds);

router.use(isAuthenticated);
router.post("/", createBed);
router.patch('/:id', updateBed);
router.delete("/:id", deleteBed);


export { router as BedRoutes }
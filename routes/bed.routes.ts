import express from "express";
import {createBed, deleteBed, getAllBeds, updateBed} from "../controllers";


const router = express.Router();

router.post("/", createBed)
router.get("/", getAllBeds)
router.patch('/:id', updateBed)
router.delete("/:id", deleteBed)


export { router as BedRoutes }
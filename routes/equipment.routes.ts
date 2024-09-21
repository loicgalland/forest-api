import express from "express";
import {createEquipment, deleteEquipment, getAllEquipments, updateEquipment} from "../controllers";


const router = express.Router();

router.post("/", createEquipment);
router.get("/", getAllEquipments)
router.patch('/:id', updateEquipment)
router.delete("/:id", deleteEquipment);


export { router as EquipmentRoutes }
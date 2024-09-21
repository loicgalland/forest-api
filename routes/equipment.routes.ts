import express from "express";
import {createEquipment, deleteEquipment, getAllEquipments, updateEquipment} from "../controllers";
import {isAuthenticated} from "../middlewares";


const router = express.Router();

router.get("/", getAllEquipments);
router.use(isAuthenticated);
router.post("/", createEquipment);
router.patch('/:id', updateEquipment);
router.delete("/:id", deleteEquipment);


export { router as EquipmentRoutes }
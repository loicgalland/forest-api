import express from "express";
import {createEquipment, deleteEquipment, getAllEquipments, updateEquipment} from "../controllers";
import {isAdminAuthenticated} from "../middlewares/ensureAdminAuthenticated.middleware";


const router = express.Router();

router.get("/", getAllEquipments);
router.use(isAdminAuthenticated);
router.post("/", createEquipment);
router.patch('/:id', updateEquipment);
router.delete("/:id", deleteEquipment);


export { router as EquipmentRoutes }
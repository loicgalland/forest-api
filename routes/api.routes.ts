import {Router} from "express";
import {BedRoutes} from "./bed.routes";
import {EquipmentRoutes} from "./equipment.routes";
import {HostingRoutes} from "./hosting.routes";

const router = Router();

router.use('/bed', BedRoutes);
router.use('/equipment', EquipmentRoutes);
router.use('/hosting', HostingRoutes)

export { router as ApiRoutes }
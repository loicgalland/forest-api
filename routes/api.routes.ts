import {Router} from "express";
import {BedRoutes} from "./bed.routes";
import {EquipmentRoutes} from "./equipment.routes";
import {HostingRoutes} from "./hosting.routes";
import {AuthRoutes} from "./auth.routes";
import {ActivityRoutes} from "./activity.routes";

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/bed', BedRoutes);
router.use('/equipment', EquipmentRoutes);
router.use('/hosting', HostingRoutes)
router.use('/activity', ActivityRoutes)

export { router as ApiRoutes }
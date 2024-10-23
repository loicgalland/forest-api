import {Router} from "express";
import {BedRoutes} from "./bed.routes";
import {EquipmentRoutes} from "./equipment.routes";
import {HostingRoutes} from "./hosting.routes";
import {AuthRoutes} from "./auth.routes";
import {ActivityRoutes} from "./activity.routes";
import {EventRoutes} from "./event.routes";
import {BookingRoutes} from "./booking.routes";

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/bed', BedRoutes);
router.use('/equipment', EquipmentRoutes);
router.use('/hosting', HostingRoutes)
router.use('/activity', ActivityRoutes)
router.use('/event', EventRoutes)
router.use('/booking', BookingRoutes)

export { router as ApiRoutes }
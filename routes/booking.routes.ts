import express from "express";
import {isAdminAuthenticated, isAuthenticated} from "../middlewares";
import {
    createBooking, getAllBooking,
    getAllHostingBookings,
    getAllUserBookings,
    updateBookingStatus
} from "../controllers/booking.controllers";


const router = express.Router();


router.use(isAuthenticated);
router.post("/", createBooking);
router.get("/:id", getAllHostingBookings);
router.get("/user/:id", getAllUserBookings);
router.patch('/:id', );
router.delete("/:id", );
router.put("/:id", updateBookingStatus)

router.use(isAdminAuthenticated);
router.get("/", getAllBooking);



export { router as BookingRoutes }
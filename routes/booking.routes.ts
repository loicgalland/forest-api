import express from "express";
import {isAdminAuthenticated, isAuthenticated} from "../middlewares";
import {createBooking, getAllHostingBookings, getAllUserBookings} from "../controllers/booking.controllers";


const router = express.Router();


router.use(isAuthenticated);
router.post("/", createBooking);
router.get("/:id", getAllHostingBookings, );
router.get("/user/:id", getAllUserBookings);
router.patch('/:id', );
router.delete("/:id", );

router.use(isAdminAuthenticated);
router.get("/", );



export { router as BookingRoutes }
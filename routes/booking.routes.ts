import express from "express";
import { isAdminAuthenticated, isAuthenticated } from "../middlewares";
import {
  confirmedBooking,
  createBooking,
  getAllBooking,
  getAllHostingBookings,
  getAllUserBookings,
  refundRequest,
  updateBookingStatus,
} from "../controllers/booking.controllers";

const router = express.Router();

router.use(isAuthenticated);
router.post("/", createBooking);
router.get("/:id", getAllHostingBookings);
router.get("/user/:id", getAllUserBookings);
router.patch("/:id");
router.delete("/:id");
router.put("/:id", updateBookingStatus);
router.get("/refund/:id", refundRequest);

router.use(isAdminAuthenticated);
router.get("/", getAllBooking);
router.get("/confirmation/:id", confirmedBooking);

export { router as BookingRoutes };

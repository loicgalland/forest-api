import express from "express";
import {isAuthenticated} from "../middlewares";
import {processStripeSessionPayment} from "../controllers/stripe-session.controller";

const router = express.Router();

router.use(isAuthenticated);
router.post('/stripe-session', processStripeSessionPayment)

export { router as StripeRoutes }
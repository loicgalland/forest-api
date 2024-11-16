import express from "express";
import {isAuthenticated} from "../middlewares";
import {processStripeSessionPayment} from "../controllers/stripe-session.controller";
import {getCashBackService} from "../services/stripe.service";

const router = express.Router();

router.use(isAuthenticated);
router.post('/stripe-session', processStripeSessionPayment);
router.post('/stripe-cash-back/:id', getCashBackService);

export { router as StripeRoutes }
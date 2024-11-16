import express from "express";
import {isAuthenticated} from "../middlewares";
import {cashBackSession, processStripeSessionPayment} from "../controllers/stripe-session.controller";

const router = express.Router();

router.use(isAuthenticated);
router.post('/stripe-session', processStripeSessionPayment);
router.post('/stripe-cash-back/:id', cashBackSession);

export { router as StripeRoutes }
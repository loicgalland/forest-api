import {Request, Response, NextFunction} from "express";
import {createStripeSession} from "../services/stripe.service";

export const processStripeSessionPayment = async (req: Request, res: Response, next: NextFunction) => {
    const { amount, currency, bookingId } = req.body;
    try{
        const session = await createStripeSession(currency, amount, bookingId);
        res.json({ id: session.id });
    } catch(error){
        next(error)
    }
}
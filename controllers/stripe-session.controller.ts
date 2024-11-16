import {NextFunction, Request, Response} from "express";
import {createStripeSession, getCashBackService} from "../services/stripe.service";
import {Booking} from "../database/models";

export const processStripeSessionPayment = async (req: Request, res: Response, next: NextFunction) => {
    const { amount, currency, bookingId } = req.body;
    try{
        const session = await createStripeSession(currency, amount, bookingId);
        const booking = await Booking.findOne({_id: bookingId});

        if (!booking) {
            return res.jsonError("Booking not found", 404);
        }
        booking.stripeSessionId = session.id;
        booking.save();

        res.jsonSuccess({ id: session.id }, 200);
    } catch(error){
        next(error)
    }
}

export const cashBackSession = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    try {
       const refund = await getCashBackService(id);
       if(refund === null) return res.jsonError("Cash Back error", 500);
        return res.jsonSuccess(refund, 200)
    } catch (error) {
        next(error)
    }
}
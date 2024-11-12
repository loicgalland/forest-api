import {Request, Response, NextFunction} from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
    apiVersion: '2024-10-28.acacia',
});

export const processStripeSessionPayment = async (req: Request, res: Response, next: NextFunction) => {
    const { amount, currency, bookingId } = req.body;
    console.log(bookingId)
    try{
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: {
                            name: 'Réservation',
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success/` + bookingId,
            cancel_url: `${process.env.CLIENT_URL}/cancel/` + bookingId,
        });

        res.json({ id: session.id });
    } catch(error){
        next(error)
    }
}
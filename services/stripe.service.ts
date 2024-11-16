import Stripe from "stripe";
import dotenv from "dotenv";
import {Booking} from "../database/models";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
    apiVersion: '2024-10-28.acacia',
});

export const createStripeSession = (currency: string, amount: number, bookingId: string) => {
    return stripe.checkout.sessions.create({
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
}

export const getCashBackService = async (bookingId: string) => {
    const booking = await Booking.findOne({_id: bookingId});
    if (!booking || (booking && !booking.stripeSessionId)) {
        return null
    }

    const stripeSessionId = booking.stripeSessionId
    if(!stripeSessionId) {
        return null;
    }

    const stripeSession = await stripe.checkout.sessions.retrieve(stripeSessionId);
    if (!stripeSession.payment_intent) {
        return null;
    }

    const paymentIntentId = typeof stripeSession.payment_intent === 'string'
        ? stripeSession.payment_intent
        : stripeSession.payment_intent.id;


    const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
    });

    booking.status = 'refunded';
    await booking.save();

    return refund;
}
import Stripe from "stripe";
import dotenv from "dotenv";

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
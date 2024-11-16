import {createStripeSession} from "./stripe.service";

describe('Create Stripe Session', () => {
    describe('Scenario: Happy Path', () => {
        const bookingId = "bookingId";
        const amount = 4000;
        const currency = "eur";
        it('Should return the correct amount_total', async () => {
            const session = await createStripeSession(currency, amount, bookingId);

            expect(session.amount_total).toBe(amount);
            expect(session.currency).toBe(currency);
        })
    })
})
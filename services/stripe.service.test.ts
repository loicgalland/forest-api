import { getCashBackService } from "./stripe.service";
import { Booking } from "../database/models";

jest.mock("../database/models/Booking.model");
jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        retrieve: jest.fn().mockResolvedValue({
          payment_intent: "mock_payment_intent_id",
        }),
      },
    },
    refunds: {
      create: jest.fn().mockResolvedValue("mock_refund"),
    },
  }));
});
describe("getCashBackService", () => {
  it("should return null if booking does not exist", async () => {
    (Booking.findById as jest.Mock).mockResolvedValue(null);
    const result = await getCashBackService("invalidBookingId");
    expect(result).toBeNull();
  });
  it("Should return an error if stripeSessionId does not exist", async () => {
    (Booking.findById as jest.Mock).mockResolvedValue({
      hostingId: "mockHostingId",
      userId: "mockUserId",
      startDate: "2024-11-14T23:00:00.000Z",
      endDate: "2024-11-18T23:00:00.000Z",
      numberOfPerson: 2,
    });
    const result = await getCashBackService("mockHostingId");
    expect(result).toBeNull();
  });
});

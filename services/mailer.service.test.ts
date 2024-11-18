import { processMail } from "./mailer.service";
import { Hosting } from "../database/models";
import { User } from "../database/models";
import { formatDate } from "./date.service";

jest.mock("../database/models/Hosting.model");
jest.mock("../database/models/User.model");
jest.mock("./date.service");

describe("processMail", () => {
  it("should return the correct mail options for bookedAdmin", async () => {
    const mockBooking = {
      hostingId: "mockHostingId",
      userId: "mockUserId",
      startDate: "2024-11-14T23:00:00.000Z",
      endDate: "2024-11-18T23:00:00.000Z",
      numberOfPerson: 2,
    };

    const mockHosting = {
      id: "mockHostingId",
      name: "Mock Hosting Name",
    };

    const mockUser = {
      email: "mockuser@example.com",
      firstName: "Mock",
      lastName: "User",
    };

    (Hosting.findById as jest.Mock).mockResolvedValue(mockHosting);
    (User.findById as jest.Mock).mockResolvedValue(mockUser);
    (formatDate as jest.Mock)
      .mockReturnValueOnce("15 nov 2024")
      .mockReturnValueOnce("19 nov 2024");

    const result = await processMail("bookedAdmin", mockBooking as any);

    expect(result).toEqual({
      to: process.env.MAILER_USER,
      subject: "Confirmation de réservation : Mock Hosting Name",
      text: `
      <p style="font-size: 17px; color: #482A2A">
      Une réservation à été faite pour l'hébergement : <strong>Mock Hosting Name (id : mockHostingId)</strong>,<br>
      </p>
      Identifiants: 
      <ul>
        <li><strong>Nom de l'hébergement :Mock Hosting Name</strong></li>
        <li><strong>Du : 15 nov 2024</strong></li>
        <li><strong>Au : 19 nov 2024</strong></li>
        <li><strong>Nombre de personne : 2</strong></li>
      </ul>
      </p>`,
    });

    // Vérifications des appels
    expect(Hosting.findById).toHaveBeenCalledWith("mockHostingId");
    expect(User.findById).toHaveBeenCalledWith("mockUserId");
    expect(formatDate).toHaveBeenCalledTimes(2);
    expect(formatDate).toHaveBeenCalledWith("2024-11-14T23:00:00.000Z");
    expect(formatDate).toHaveBeenCalledWith("2024-11-18T23:00:00.000Z");
  });
});

import { processMail } from "./mailer.service";
import { Hosting } from "../database/models";
import { User } from "../database/models";
import { formatDate } from "./date.service";

jest.mock("../database/models/Hosting.model");
jest.mock("../database/models/User.model");
jest.mock("./date.service");

describe("processMail", () => {
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

  beforeEach(() => {
    jest.clearAllMocks(); // Réinitialiser les mocks avant chaque test
    (Hosting.findById as jest.Mock).mockResolvedValue(mockHosting);
    (User.findById as jest.Mock).mockResolvedValue(mockUser);
    (formatDate as jest.Mock)
      .mockReturnValueOnce("15 nov 2024")
      .mockReturnValueOnce("19 nov 2024");
  });

  it("should return the correct mail options for bookedAdmin", async () => {
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
  });

  it("Should return the correct mail options for bookedUser", async () => {
    const result = await processMail("bookedUser", mockBooking as any);
    expect(result).toEqual({
      to: mockUser.email,
      subject: "FOREST - Récapitulatif de réservation : Mock Hosting Name",
      text: `
      <p style="font-size: 17px; color: #482A2A">Toute l'équipe de Forest vous remercie !</p>
      <p style="font-size: 17px; color: #482A2A">
      Votre réservation est faite pour l'hébergement : <strong>Mock Hosting Name</strong>,<br>
      </p>
      <p style="font-size: 15px; color: #482A2A">Date d'arrivée : <strong>15 nov 2024</strong>,<br>Date de départ : <strong>19 nov 2024</strong>,<br>Nombre de personne : <strong>2</strong></p>
      <p style="font-size: 17px; color: #482A2A">Vous recevrez un mail quand votre réservation sera confirmée par notre équipe</p>
      <p style="font-size: 17px; color: #482A2A">Belle journée à vous, à très vite !</p>`,
    });
  });

  it("Should return the correct mail options for cancelBookingConfirmation", async () => {
    const result = await processMail(
      "cancelBookingConfirmation",
      mockBooking as any,
    );
    expect(result).toEqual({
      to: process.env.MAILER_USER,
      subject: `Annulation de réservation de la Mock Hosting Name confirmée`,
      text: `
      <p style="font-size: 17px; color: #482A2A">
      Annulation de réservation de l'hébergement : <strong>Mock Hosting Name (id : mockHostingId)</strong>,<br>
      </p>
      <p style="font-size: 15px; color: #482A2A">Date d'arrivée : <strong>15 nov 2024</strong>,<br>Date de départ :  <strong>19 nov 2024</strong>,<br>Nombre de personne : <strong>2</strong>,<br>
      Identifiants: 
      <ul>
        <li>mail : mockuser@example.com</li>
        <li> nom :  User</li>
        <li>prénom : Mock</li>
      </ul>
      </p>`,
    });
  });

  it("Should return the correct mail options for cancelBookingRequest", async () => {
    const result = await processMail(
      "cancelBookingRequest",
      mockBooking as any,
    );
    expect(result).toEqual({
      to: process.env.MAILER_USER,
      subject: `Demande de remboursement pour la réservation : Mock Hosting Name`,
      text: `
      <p style="font-size: 17px; color: #482A2A">
      Une réservation à été faite pour l'hébergement : <strong>Mock Hosting Name (id : mockHostingId)</strong>,<br>
      </p>
      <p style="font-size: 15px; color: #482A2A">Date d'arrivée : <strong>15 nov 2024</strong>,<br>Date de départ :  <strong>19 nov 2024</strong>,<br>Nombre de personne : <strong>2</strong>,<br>
      Identifiants: 
      <ul>
        <li>mail : mockuser@example.com</li>
        <li>nom :  User</li>
        <li>prénom : Mock</li>
      </ul>
      </p>`,
    });
  });

  it("Should return the correct mail options for confirmedBooking", async () => {
    const result = await processMail("confirmedBooking", mockBooking as any);

    expect(result).toEqual({
      to: "mockuser@example.com",
      subject: `FOREST - Confirmation de réservation : Mock Hosting Name`,
      text: `
      <p style="font-size: 17px; color: #482A2A">Félicitations, votre réservation est confirmée</p>
      <p style="font-size: 17px; color: #482A2A">
      Récapitulatif : <br>
       <ul>
        <li>Nom de l'hébergement : <strong>Mock Hosting Name</strong></li>
        <li>Du : <strong>15 nov 2024</strong></li>
        <li>Au : <strong>19 nov 2024</strong></li>
        <li>Pour : <strong>2</strong> personne(s)</li>
      </ul>
      </p>
      <p style="font-size: 17px; color: #482A2A">Belle journée à vous, à très vite !</p>      
`,
    });
  });
});

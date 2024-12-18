import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { BookingDoc, Hosting, User } from "../database/models";
import { formatDate } from "./date.service";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  const mailOptions = {
    to: to,
    subject: subject,
    html: text,
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error in mail sending:", error);
  }
};

export const processMail = async (type: string, booking: BookingDoc) => {
  let to;
  let subject;
  let text;
  const hosting = await Hosting.findById(booking.hostingId);
  const user = await User.findById(booking.userId);

  switch (type) {
    case "bookedAdmin":
      to = process.env.MAILER_USER;
      subject = `Confirmation de réservation : ${hosting ? hosting.name : ""}`;
      text = `
      <p style="font-size: 17px; color: #482A2A">
      Une réservation à été faite pour l'hébergement : <strong>${hosting ? hosting.name : ""} (id : ${hosting ? hosting.id : ""})</strong>,<br>
      </p>
      Identifiants: 
      <ul>
        <li><strong>Nom de l'hébergement :${hosting ? hosting.name : ""}</strong></li>
        <li><strong>Du : ${formatDate(booking.startDate)}</strong></li>
        <li><strong>Au : ${formatDate(booking.endDate)}</strong></li>
        <li><strong>Nombre de personne : ${booking.numberOfPerson}</strong></li>
      </ul>
      </p>`;
      return { to, subject, text };
    case "bookedUser":
      to = user ? user.email : "";
      subject = `FOREST - Récapitulatif de réservation : ${hosting ? hosting.name : ""}`;
      text = `
      <p style="font-size: 17px; color: #482A2A">Toute l'équipe de Forest vous remercie !</p>
      <p style="font-size: 17px; color: #482A2A">
      Votre réservation est faite pour l'hébergement : <strong>${hosting ? hosting.name : ""}</strong>,<br>
      </p>
      <p style="font-size: 15px; color: #482A2A">Date d'arrivée : <strong>${formatDate(booking.startDate)}</strong>,<br>Date de départ : <strong>${formatDate(booking.endDate)}</strong>,<br>Nombre de personne : <strong>${booking.numberOfPerson}</strong></p>
      <p style="font-size: 17px; color: #482A2A">Vous recevrez un mail quand votre réservation sera confirmée par notre équipe</p>
      <p style="font-size: 17px; color: #482A2A">Belle journée à vous, à très vite !</p>`;
      return { to, subject, text };
    case "cancelBookingConfirmation":
      to = process.env.MAILER_USER;
      subject = `Annulation de réservation de la ${hosting ? hosting.name : ""} confirmée`;
      text = `
      <p style="font-size: 17px; color: #482A2A">
      Annulation de réservation de l'hébergement : <strong>${hosting ? hosting.name : ""} (id : ${hosting ? hosting.id : ""})</strong>,<br>
      </p>
      <p style="font-size: 15px; color: #482A2A">Date d'arrivée : <strong>${formatDate(booking.startDate)}</strong>,<br>Date de départ :  <strong>${formatDate(booking.endDate)}</strong>,<br>Nombre de personne : <strong>${booking.numberOfPerson}</strong>,<br>
      Identifiants: 
      <ul>
        <li>mail : ${user ? user.email : ""}</li>
        <li> nom :  ${user ? user.lastName : ""}</li>
        <li>prénom : ${user ? user.firstName : ""}</li>
      </ul>
      </p>`;
      return { to, subject, text };
    case "cancelBookingRequest":
      to = process.env.MAILER_USER;
      subject = `Demande de remboursement pour la réservation : ${hosting ? hosting.name : ""}`;
      text = `
      <p style="font-size: 17px; color: #482A2A">
      Une réservation à été faite pour l'hébergement : <strong>${hosting ? hosting.name : ""} (id : ${hosting ? hosting.id : ""})</strong>,<br>
      </p>
      <p style="font-size: 15px; color: #482A2A">Date d'arrivée : <strong>${formatDate(booking.startDate)}</strong>,<br>Date de départ :  <strong>${formatDate(booking.endDate)}</strong>,<br>Nombre de personne : <strong>${booking.numberOfPerson}</strong>,<br>
      Identifiants: 
      <ul>
        <li>mail : ${user ? user.email : ""}</li>
        <li>nom :  ${user ? user.lastName : ""}</li>
        <li>prénom : ${user ? user.firstName : ""}</li>
      </ul>
      </p>`;
      return { to, subject, text };
    case "confirmedBooking":
      to = user ? user.email : "";
      subject = `FOREST - Confirmation de réservation : ${hosting ? hosting.name : ""}`;
      text = `
      <p style="font-size: 17px; color: #482A2A">Félicitations, votre réservation est confirmée</p>
      <p style="font-size: 17px; color: #482A2A">
      Récapitulatif : <br>
       <ul>
        <li>Nom de l'hébergement : <strong>${hosting ? hosting.name : ""}</strong></li>
        <li>Du : <strong>${formatDate(booking.startDate)}</strong></li>
        <li>Au : <strong>${formatDate(booking.endDate)}</strong></li>
        <li>Pour : <strong>${booking.numberOfPerson}</strong> personne(s)</li>
      </ul>
      </p>
      <p style="font-size: 17px; color: #482A2A">Belle journée à vous, à très vite !</p>      
`;
      return { to, subject, text };
  }
};

export const processContactMail = async (
  subject: string,
  text: string,
  fromEmail: string,
) => {
  const message = `
      <p style="font-size: 17px; color: #482A2A">Contact</p>
      <p style="font-size: 17px; color: #482A2A">
      De la part de : ${fromEmail}
      </p>
      <p style="font-size: 17px; color: #482A2A">Contenu : <br>
       ${text}
      </p>      
`;
  const mailOptions = {
    to: process.env.MAILER_USER,
    subject: subject,
    html: message,
  };
  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error in sending contact email:", error);
  }
};

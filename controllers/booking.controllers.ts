import { NextFunction, Request, Response } from "express";
import { ValidatorRequest } from "../utility/validate-request";
import { CreateBookingInputs } from "../dto/booking.dto";
import { Booking } from "../database/models";
import { Event } from "../database/models";
import { processMail, sendEmail } from "../services/mailer.service";
import dotenv from "dotenv";

dotenv.config();
export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body as CreateBookingInputs;
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    if (body.startDate) {
      startDate = new Date(body.startDate);
    }
    if (body.endDate) {
      endDate = new Date(body.endDate);
    }
    const { errors, input } = await ValidatorRequest(CreateBookingInputs, {
      ...body,
      startDate,
      endDate,
    });

    if (errors) {
      return res.jsonError(errors, 400);
    }
    let existingReservations = [];
    if (body.hostingId) {
      existingReservations = await Booking.find({
        hostingId: body.hostingId,
        $or: [
          { startDate: { $lt: body.endDate, $gte: body.startDate } },
          { endDate: { $gt: body.startDate, $lte: body.endDate } },
          {
            startDate: { $gte: body.startDate, $lte: body.endDate },
            endDate: { $lte: body.endDate },
          },
        ],
      });
    }

    if (existingReservations.length) {
      return res.status(409).json({ message: "Dates not available" });
    }
    const status = "pending";

    const newBooking = new Booking({ ...input, startDate, endDate, status });

    const eventsId = body.events;
    for (const eventId of eventsId) {
      const event = await Event.findById(eventId);
      if (event && event.placeAvailable < body.numberOfPerson) {
        return res.jsonSuccess("No more place available", 200);
      }

      await Event.findByIdAndUpdate(eventId, {
        $inc: { placeAvailable: -body.numberOfPerson },
      });
    }

    await newBooking.save();
    return res.jsonSuccess(newBooking, 201);
  } catch (error) {
    next(error);
  }
};

export const getAllHostingBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const bookings = await Booking.find({ hostingId: id });
    if (!bookings) {
      return res.jsonError("No hosting found ", 404);
    }
    if (!bookings.length) {
      return res.jsonSuccess("No booking found for this hosting", 200);
    }
    return res.jsonSuccess(bookings, 200);
  } catch (error) {
    next(error);
  }
};

export const getAllBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bookings = await Booking.find();
    if (bookings.length) return res.jsonSuccess(bookings, 200);
    return res.jsonSuccess("'No bookings", 200);
  } catch (error) {
    next(error);
  }
};

export const getAllUserBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const bookings = await Booking.find({ userId: id })
      .populate({
        path: "hostingId",
        select: "name",
      })
      .populate({
        path: "activities",
        select: "name",
      })
      .populate({
        path: "events",
        select: "name date",
      });
    if (!bookings) {
      return res.jsonError("No hosting found ", 404);
    }
    if (!bookings.length) {
      return res.jsonSuccess(null, 200);
    }
    return res.jsonSuccess(bookings, 200);
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const booking = await Booking.findById(id);
    if (!booking) return res.jsonError("No booking found ", 404);
    booking.status = status;
    const savedBooking = await booking.save();

    const mailInfoAdmin = await processMail("bookedAdmin", booking);
    if (mailInfoAdmin) {
      sendEmail(mailInfoAdmin.to, mailInfoAdmin.subject, mailInfoAdmin.text);
    }

    const mailInfoUser = await processMail("bookedUser", booking);
    if (mailInfoUser) {
      sendEmail(mailInfoUser.to, mailInfoUser.subject, mailInfoUser.text);
    }

    return res.jsonSuccess(savedBooking, 200);
  } catch (error) {
    next(error);
  }
};

export const refundRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);
  if (!booking) return res.jsonError("No booking found ", 404);
  const mailInfoAdmin = await processMail("cancelBookingRequest", booking);
  if (mailInfoAdmin) {
    sendEmail(mailInfoAdmin.to, mailInfoAdmin.subject, mailInfoAdmin.text);
  }

  booking.status = "refundRequested";
  booking.save();
  return res.jsonSuccess("Success", 200);
};

export const confirmedBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);
  if (!booking) return res.jsonError("No booking found ", 404);
  const mailInfoUser = await processMail("confirmedBooking", booking);
  if (mailInfoUser) {
    sendEmail(mailInfoUser.to, mailInfoUser.subject, mailInfoUser.text);
  }
  booking.status = "confirmed";
  booking.save();
  return res.jsonSuccess("Success", 200);
};

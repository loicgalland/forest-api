import { Request, Response, NextFunction } from "express";
import { processContactMail } from "../services/mailer.service";

export const sendContactMail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { sender, subject, message } = req.body;
  await processContactMail(subject, message, sender);
  return res.jsonSuccess("Email send successfully", 200);
};

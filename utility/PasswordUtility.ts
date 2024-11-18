import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthPayload } from "../dto/Auth.dto";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY!;

export const generateSalt = () => {
  return bcrypt.genSalt();
};

export const hashPassword = (password: string, salt: string) => {
  return bcrypt.hash(password, salt);
};

export const isValidatedPassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string,
) => {
  return (await hashPassword(enteredPassword, salt)) === savedPassword;
};

export const generateSignature = (payload: AuthPayload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
};

export const decodeJwt = (token: string) => {
  return jwt.verify(token, SECRET_KEY);
};

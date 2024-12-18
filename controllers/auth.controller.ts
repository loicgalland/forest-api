import { Request, Response, NextFunction } from "express";
import { CreateUserInputs, LoginUserInputs } from "../dto/user.dto";
import { User } from "../database/models/User.model";
import {
  decodeJwt,
  generateSalt,
  generateSignature,
  hashPassword,
  isValidatedPassword,
} from "../utility";
import { AuthPayload } from "../dto/Auth.dto";
import { passwordValidation } from "../services/password.service";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = <CreateUserInputs>req.body;
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return res.jsonError("This user already exist", 409);
    }
    if (!passwordValidation(body.password)) {
      return res.jsonError(
        "Votre mot de passe doit contenir au moins 12 carractères, un caractère spéciale, une minuscule, une" +
          " majuscule et un chiffre",
        400,
      );
    }
    const salt = await generateSalt();
    const hashedPassword = await hashPassword(body.password, salt);

    const newUser = await User.create({
      ...body,
      salt,
      password: hashedPassword,
    });

    await newUser.save();
    return res.jsonSuccess(newUser, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = <LoginUserInputs>req.body;
    const existingUser = await User.findOne({ email }).exec();

    if (!existingUser) {
      return res.jsonError("Wrong credentials", 403);
    }

    const isValidPassword = await isValidatedPassword(
      password,
      existingUser.password,
      existingUser.salt,
    );

    if (!isValidPassword) {
      return res.jsonError("Wrong credentials", 403);
    }

    const token = generateSignature({
      _id: existingUser._id as string,
      email: existingUser.email,
      role: existingUser.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.jsonSuccess(
      { message: "Login successful", userId: existingUser._id },
      200,
    );
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return res.jsonSuccess({ message: "Logout successful" }, 200);
  } catch (error) {
    next(error);
  }
};

export const getUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;

  if (!token) {
    res.json({ role: null, userId: null });
  }
  try {
    const decoded = decodeJwt(token) as AuthPayload;
    res.json({ role: decoded.role, userId: decoded._id, email: decoded.email });
  } catch (error) {
    next(error);
  }
};

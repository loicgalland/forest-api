import { NextFunction, Request, Response } from "express";
import { CreateBedInputs } from "../dto/bed.dto";
import { Bed } from "../database/models";
import { ValidatorRequest } from "../utility";

export const createBed = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body as CreateBedInputs;
    const { errors, input } = await ValidatorRequest(CreateBedInputs, body);

    if (errors) {
      return res.jsonError(errors, 400);
    }

    const existingBed = await Bed.findOne({ name: input.name });
    if (existingBed) {
      return res.jsonError("This bed already exist", 409);
    }

    const newBed = await Bed.create(input);
    await newBed.save();
    return res.jsonSuccess(newBed, 201);
  } catch (error) {
    next(error);
  }
};

export const getAllBeds = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const beds = await Bed.find({});

    if (beds.length) return res.jsonSuccess(beds, 200);
    return res.jsonSuccess(null, 200);
  } catch (error) {
    next(error);
  }
};

export const updateBed = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const { name, place } = req.body;
  try {
    const bed = await Bed.findById(id);
    if (!bed) {
      return res.jsonError("Bed not found", 404);
    }
    if (name !== undefined) bed.name = name;
    if (place !== undefined) bed.place = place;
    const bedSaved = await bed.save();
    return res.jsonSuccess(bedSaved, 200);
  } catch (error) {
    next(error);
  }
};

export const deleteBed = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    await Bed.findById(id);
    return res.jsonSuccess("Bed delete", 404);
  } catch (error) {
    next(error);
  }
};

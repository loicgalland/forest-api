import { NextFunction, Request, Response } from "express";
import { Equipment } from "../database/models";
import { CreateEquipmentInputs } from "../dto/equipment.dto";
import { ValidatorRequest } from "../utility/validate-request";

export const createEquipment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body as CreateEquipmentInputs;
    const { errors, input } = await ValidatorRequest(
      CreateEquipmentInputs,
      body,
    );

    if (errors) {
      return res.jsonError(errors, 400);
    }

    const existingEquipment = await Equipment.findOne({ name: input.name });
    if (existingEquipment) {
      return res.jsonError("This equipment already exist", 409);
    }

    const newEquipment = await Equipment.create({ ...input });
    await newEquipment.save();
    return res.jsonSuccess(newEquipment, 201);
  } catch (error) {
    next(error);
  }
};

export const getAllEquipments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const equipments = await Equipment.find({});

    if (equipments.length) return res.jsonSuccess(equipments, 200);
    return res.jsonError("No equipments found", 404);
  } catch (error) {
    next(error);
  }
};

export const updateEquipment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const equipment = await Equipment.findById(id);
    if (!equipment) {
      return res.jsonError("Equipment not found", 404);
    }
    if (name !== undefined) equipment.name = name;
    const equipmentSaved = await equipment.save();
    return res.jsonSuccess(equipmentSaved, 200);
  } catch (error) {
    next(error);
  }
};

export const deleteEquipment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    await Equipment.findById(id);
    return res.jsonSuccess("Equipment delete", 404);
  } catch (error) {
    next(error);
  }
};

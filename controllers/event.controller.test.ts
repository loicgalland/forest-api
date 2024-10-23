import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ValidatorRequest } from '../utility';
import {Event} from "../database/models";
import {createEvent} from "./event.controller";

jest.mock('../utility/validate-request');
jest.mock('../database/models/Event.model');

describe('EventController', () => {
    describe('Scenario Happy path', () => {
        const req= {
            body:{
                name: 'Concert',
                description: 'Concert de rock',
                visible: true,
                images: ['6713858aa259568886ba7696'],
                capacity: 40,
                price: 25,
                date: "2024-10-31T23:00:00.000+00:00",
                placeAvailable: 40,
            }
        } as Partial<Request>;

        const res = {
            jsonSuccess: jest.fn(),
            jsonError: jest.fn(),
        } as Partial<Response>;

        const next = jest.fn() as NextFunction;

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("Should return code 201", async() => {
            (ValidatorRequest as jest.Mock).mockResolvedValue({
                errors: null,
                input: req.body,
            });
            const mockEvent = {
                save: jest.fn().mockResolvedValue({ _id: new mongoose.Types.ObjectId(), ...req.body }),
            };
            (Event.create as jest.Mock).mockResolvedValue(mockEvent)

            await createEvent(req as Request, res as Response, next);

            expect(res.jsonSuccess).toHaveBeenCalledWith(expect.any(Object), 201);
        })
    })
})
import { createActivity } from './activity.controller';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ValidatorRequest } from '../utility/validate-request';
import {Activity} from "../database/models";

jest.mock('../utility/validate-request');
jest.mock('../database/models/Activities.model');

describe('ActivityController', () => {
    describe('Scenario: Happy path', () => {
        const req = {
            body: {
                name: 'Cours de cuisine',
                description: 'Cours de cuisine',
                isSpotlight: true,
                visible: true,
                images: ['6713858aa259568886ba7696'],
                capacity: 5,
                price: 15,
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

        it('should return code 201', async () => {
            (ValidatorRequest as jest.Mock).mockResolvedValue({
                errors: null,
                input: req.body,
            });

            const mockActivity = {
                save: jest.fn().mockResolvedValue({ _id: new mongoose.Types.ObjectId(), ...req.body }),
            };
            (Activity.create as jest.Mock).mockResolvedValue(mockActivity);

            await createActivity(req as Request, res as Response, next);

            expect(res.jsonSuccess).toHaveBeenCalledWith(expect.any(Object), 201);
        });
    });
});
import {NextFunction, Request, Response} from 'express';
import {CreatePriceInputs} from "../dto/price.dto";
import {Price} from "../database/models/Price.model";
import {CreateBedInputs} from "../dto/bed.dto";
import {ValidatorRequest} from "../utility/validate-request";


export const createPrice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body as CreatePriceInputs;
        const {errors, input} = await ValidatorRequest(CreatePriceInputs, body);

        if(errors) {
            return res.jsonError(errors, 400)
        };


        const existingPrice = await Price.findOne({htAmount: input.htAmount});
        if (existingPrice) {
            return res.jsonError('This price already exist', 409)
        }

        const newPrice = new Price({...input})
        await newPrice.save();
        return res.jsonSuccess(newPrice, 201)
    } catch (error) {
        next(error)
    }
}

export const updatePrice = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const {htAmout, startDate, endDate} = req.body;
    try {
        const price = await Price.findById(id);
        if (!price) {
            return res.jsonError('Price not found', 404)
        }
        if (htAmout !== undefined) price.htAmount = htAmout;
        if (startDate !== undefined) price.startDate = startDate;
        if (endDate !== undefined) price.endDate = endDate;

        const priceSaved = await price.save();
        return res.jsonSuccess(priceSaved, 200)
    } catch (error) {
        next(error)
    }
}

export const deletePrice = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    try {
        await Price.findById(id);
        return res.jsonSuccess('Price delete', 404)

    } catch (error) {
        next(error)
    }
}

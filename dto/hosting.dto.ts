import {CreatePriceInputs} from "./price.dto";
import {IsBoolean, IsNotEmpty, IsString, ValidateNested} from "class-validator";

export interface CreateBedInput {
    bedId: string;
    quantity: number;
}

export interface CreateEquipmentInput {
    equipmentId: string;
    quantity: number;
}


export class CreateHostingInputs {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsBoolean()
    @IsNotEmpty()
    isSpotlight: boolean;

    @IsBoolean()
    @IsNotEmpty()
    visible: boolean;

    beds: CreateBedInput[];

    equipments: CreateEquipmentInput[];

    prices: CreatePriceInputs[];
}

export class UpdateHostingInputs {
    name?: string;
    description?: string;
    isSpotLight?: boolean;
    beds?: CreateBedInput[];
    equipments?: CreateEquipmentInput[];
    prices?: CreatePriceInputs[];
}
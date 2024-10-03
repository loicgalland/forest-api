import {IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested} from "class-validator";

export interface CreateBedInput {
    bedId: string;
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

    equipments: string[];

    @IsNotEmpty()
    @IsNumber()
    price: number;
}

export class UpdateHostingInputs {
    name?: string;
    description?: string;
    isSpotLight?: boolean;
    beds?: CreateBedInput[];
    equipments?: string[];
    prices: number;
}
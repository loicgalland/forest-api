import {IsBoolean, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateEventInputs {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsBoolean()
    @IsNotEmpty()
    visible: boolean;

    @IsNotEmpty()
    @IsNumber()
    price: number;
}

export class UpdateHostingInputs {
    name?: string;
    description?: string;
    prices: number;
    visible: boolean;
}
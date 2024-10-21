import {IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString} from "class-validator";

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

    @IsNotEmpty()
    @IsDate()
    date: Date;

    @IsNotEmpty()
    @IsNumber()
    capacity: number;
}

export class UpdateEventInputs {
    name?: string;
    description?: string;
    prices: number;
    visible: boolean;
    date: Date;
    capacity: number;
}
import {IsDateString, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreatePriceInputs {
    @IsNotEmpty()
    @IsNumber()
    htAmount: string;

    @IsNotEmpty()
    @IsDateString()
    startDate: Date;

    @IsNotEmpty()
    @IsDateString()
    endDate: Date;
}

export class UpdatePriceInputs {
    @IsNotEmpty()
    @IsNumber()
    htAmount?: string;

    @IsNotEmpty()
    @IsDateString()
    startDate?: Date;

    @IsNotEmpty()
    @IsDateString()
    endDate?: Date;
}
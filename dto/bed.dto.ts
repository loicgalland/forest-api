import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateBedInputs {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    place: number;
}

export class UpdateBedInputs {
    name?: string;
    place?: number;
}
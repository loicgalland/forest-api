import {IsBoolean, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateActivityInputs {
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

    @IsNotEmpty()
    @IsNumber()
    price: number;
}

export class UpdateHostingInputs {
    name?: string;
    description?: string;
    isSpotLight?: boolean;
    prices: number;
    visible: boolean;
}
import { IsNotEmpty, IsString } from "class-validator";

export class CreateEquipmentInputs {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    type: string;
}

export class UpdateEquipmentInputs {
    @IsString()
    name?: string;

    @IsNotEmpty()
    @IsString()
    type: string;
}

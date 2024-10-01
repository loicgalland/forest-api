import { IsNotEmpty, IsString } from "class-validator";

export class CreateEquipmentInputs {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}

export class UpdateEquipmentInputs {
    @IsString()
    name?: string;

    @IsString()
    description?: string;
}

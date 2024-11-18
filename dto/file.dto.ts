import { IsNotEmpty, IsString } from "class-validator";

export class CreateFileInputs {
  @IsNotEmpty()
  @IsString()
  path: string;

  @IsNotEmpty()
  @IsString()
  originalName: string;
}

export class UpdateFileInputs {
  path: string;
  originalName: number;
}

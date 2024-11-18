import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBookingInputs {
  startDate: Date | null;

  endDate: Date | null;

  duration: number;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  numberOfPerson: number;

  hostingId: string;

  activities: string[];

  events: string[];

  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;
}

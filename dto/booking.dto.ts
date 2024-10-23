import {IsArray, IsDate, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateBookingInputs {
    @IsNotEmpty()
    @IsDate()
    startDate: Date;

    @IsNotEmpty()
    @IsDate()
    endDate: Date;

    @IsNotEmpty()
    @IsNumber()
    duration: number;

    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsNumber()
    numberOfPerson: number;

    @IsString()
    hostingId: string;

    activityId: string[];

    eventId: string[];

    @IsNotEmpty()
    @IsNumber()
    totalPrice: number;
}

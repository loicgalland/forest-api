import mongoose, {Document, Schema, Types} from "mongoose";

export interface BookingDoc extends Document {
    startDate: Date;
    endDate: Date;
    duration: number;
    userId: Types.ObjectId;
    numberOfPerson: number;
    hostingId?: Types.ObjectId,
    activities?: Types.ObjectId[],
    eventId?: Types.ObjectId[],
    status: string,
    totalPrice: number,
}

const BookingSchema = new Schema<BookingDoc>({
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    numberOfPerson: {
        type: Number,
        required: true,
    },
    hostingId: {
        type: Schema.Types.ObjectId,
        ref: 'Hosting',
        required: false,
    },
    activities: [{
        type: Schema.Types.ObjectId,
        ref: 'Activities',
        required: false,
    }],
    eventId: [{
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: false,
    }],
    status: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    }

}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret, option) {
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    }
})

const Booking = mongoose.model<BookingDoc>('Booking', BookingSchema);
export {Booking};
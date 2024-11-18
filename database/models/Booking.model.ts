import mongoose, { Document, Schema, Types } from "mongoose";

export interface BookingDoc extends Document {
  startDate?: Date | null;
  endDate?: Date | null;
  duration?: number;
  userId: Types.ObjectId;
  numberOfPerson: number;
  hostingId?: Types.ObjectId;
  activities?: Types.ObjectId[];
  events?: Types.ObjectId[];
  status: string;
  totalPrice: number;
  stripeSessionId: string | null;
}

const BookingSchema = new Schema<BookingDoc>(
  {
    startDate: {
      type: Date,
      required: false,
    },
    endDate: {
      type: Date,
      required: false,
    },
    duration: {
      type: Number,
      required: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    numberOfPerson: {
      type: Number,
      required: true,
    },
    hostingId: {
      type: Schema.Types.ObjectId,
      ref: "Hosting",
      required: false,
    },
    activities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Activity",
        required: false,
      },
    ],
    events: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: false,
      },
    ],
    status: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    stripeSessionId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
  },
);

const Booking = mongoose.model<BookingDoc>("Booking", BookingSchema);
export { Booking };

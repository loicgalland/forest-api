import mongoose, { Document, Schema, Types } from "mongoose";

export interface ActivityDoc extends Document {
  name: string;
  description: string;
  isSpotlight: boolean;
  visible: boolean;
  images: Types.ObjectId[];
  capacity: number;
  price: number;
}

const ActivitySchema = new Schema<ActivityDoc>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isSpotlight: {
      type: Boolean,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
    capacity: {
      type: Number,
      required: false,
    },
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: "File",
        required: false,
      },
    ],
    price: {
      type: Number,
      required: true,
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

const Activity = mongoose.model<ActivityDoc>("Activity", ActivitySchema);
export { Activity };

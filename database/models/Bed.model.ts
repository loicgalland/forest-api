import mongoose, { Document, Schema } from "mongoose";

export interface BedDoc extends Document {
  name: string;
  place: number;
}

const BedSchema = new Schema<BedDoc>(
  {
    name: {
      type: String,
      required: true,
    },
    place: {
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

const Bed = mongoose.model<BedDoc>("Bed", BedSchema);
export { Bed };

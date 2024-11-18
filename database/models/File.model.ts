import mongoose, { Document, Schema } from "mongoose";

export interface FileDoc extends Document {
  path: string;
  originalName: string;
}

const FileSchema = new Schema<FileDoc>(
  {
    path: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
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

const File = mongoose.model<FileDoc>("File", FileSchema);
export { File };

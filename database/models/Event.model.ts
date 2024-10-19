import mongoose, {Document, Schema, Types} from "mongoose";


export interface EventDoc extends Document {
    name: string,
    description: string,
    visible: boolean,
    images: Types.ObjectId[],
    capacity: number,
    price: number
}


const EventSchema = new Schema<EventDoc>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
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
        }
    ],
    price: {
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



const Event = mongoose.model<EventDoc>('Event', EventSchema);
export {Event};
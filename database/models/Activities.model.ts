import mongoose, {Document, Schema} from "mongoose";


export interface ActivityDoc extends Document {
    name: string,
    description: string,
    isSpotlight: boolean,
    visible: boolean,
    images: [string],
    capacity: number,
    price: number
}


const ActivitySchema = new Schema<ActivityDoc>({
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
    images:{
        type: [String],
        default: [],
        required: false,
    },
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



const Activity = mongoose.model<ActivityDoc>('Activity', ActivitySchema);
export {Activity};
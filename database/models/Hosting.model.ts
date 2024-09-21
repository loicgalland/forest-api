import mongoose, {Document, Schema} from "mongoose";

export interface HostingDoc extends Document {
    name: string,
    description: string,
    isSpotlight: boolean,

}

const HostingSchema = new Schema<HostingDoc>({
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
    }
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret, option) {
            delete ret.__v;
        }
    }
})

const Hosting = mongoose.model<HostingDoc>('Hosting', HostingSchema);
export {Hosting};
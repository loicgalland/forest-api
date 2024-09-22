import mongoose, {Document, Schema, Types} from "mongoose";


interface BedQuantity {
    bed: Types.ObjectId;
    quantity: number;
}

export interface HostingDoc extends Document {
    name: string,
    description: string,
    isSpotlight: boolean,
    beds: BedQuantity[];
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
    },
    beds: [
        {
            bed: {
                type: Schema.Types.ObjectId,
                ref: "Bed",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            }
        }
    ],
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
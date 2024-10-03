import mongoose, {Document, Schema, Types} from "mongoose";

export interface BedArray {
    bed: Types.ObjectId;
    quantity: number;
}



export interface HostingDoc extends Document {
    name: string,
    description: string,
    isSpotlight: boolean,
    visible: boolean,
    images: [string],
    capacity: number,
    beds: BedArray[];
    equipments: Types.ObjectId[];
    price: number
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
    beds: [
        {
            bed: {
                type: Schema.Types.ObjectId,
                ref: "Bed",
                required: false,
            },
            quantity: {
                type: Number,
                required: false,
            }
        }
    ],
    equipments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }],
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



const Hosting = mongoose.model<HostingDoc>('Hosting', HostingSchema);
export {Hosting};
import mongoose, {Document, Schema, Types} from "mongoose";

export interface BedArray {
    bed: Types.ObjectId;
    quantity: number;
}

interface EquipmentArray {
    equipment: Types.ObjectId;
    quantity: number;
}

interface PriceArray {
    price: Types.ObjectId;
}


export interface HostingDoc extends Document {
    name: string,
    description: string,
    isSpotlight: boolean,
    visible: boolean,
    images: [string],
    capacity: number,
    beds: BedArray[];
    equipments: EquipmentArray[];
    prices: PriceArray[]
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
    equipments: [
        {
            equipment: {
                type: Schema.Types.ObjectId,
                ref: "Equipment",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            }
        }
    ],
    prices: [
        {
            price: {
                type: Schema.Types.ObjectId,
                ref: "Price",
                required: true,
            }
        }
    ]
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
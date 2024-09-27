import mongoose, {Document, Schema, Types} from "mongoose";


interface BedArray {
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
    rating: number,
    images: [string],
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
    rating:{
        type: Number,
        default: 0.0,
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
        transform(doc, ret) {
            delete ret.__v;
        }
    }
})

const Hosting = mongoose.model<HostingDoc>('Hosting', HostingSchema);
export {Hosting};
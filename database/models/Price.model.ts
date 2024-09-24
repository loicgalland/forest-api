import mongoose, {Document, Schema} from "mongoose";

export interface PriceDoc extends Document {
    htAmount: number,
    startDate: Date,
    endDate: Date,
}

const PriceSchema = new Schema<PriceDoc>({
    htAmount: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    }
})

const Price = mongoose.model<PriceDoc>('Price', PriceSchema);
export {Price};
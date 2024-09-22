import mongoose, {Document, Schema} from "mongoose";

export interface EquipmentDoc extends Document {
    name: string,
    description: string,
}

const EquipmentSchema = new Schema<EquipmentDoc>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
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

const Equipment = mongoose.model<EquipmentDoc>('Equipment', EquipmentSchema);
export {Equipment};
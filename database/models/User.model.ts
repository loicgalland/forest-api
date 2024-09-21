import mongoose, {Document, Schema} from "mongoose";

export interface UserDoc extends Document {
   firstName: string;
   lastName: string;
   email: string;
   password: string;
   salt: string;
   role: string;
}

const UserSchema = new Schema<UserDoc>({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    }

}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret, option) {
            delete ret.__v;
            delete ret.password;
            delete ret.salt;
        }
    }
})

const User = mongoose.model<UserDoc>('User', UserSchema);
export {User};
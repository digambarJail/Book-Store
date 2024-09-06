import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    userId:number;
    name: string;
    contactNumber: number;
    address: string;
    payableRent:number;
}

const usersSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: Number,
        required: true,
    },
    contactNumber: {
        type: Number,
        required: true,
    },
    address:{
        type:String,
        required:true
    },
    payableRent:{
        type:Number,
        default:0
    }
}, { timestamps: true });

export const Users: Model<IUser> = mongoose.model<IUser>('Users', usersSchema);

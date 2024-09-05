import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITransaction extends Document {
    userId: number;
    bookName: string;
    issueDate: Date;
    returnDate: Date;
    totalRent: number;
}

const transactionsSchema: Schema<ITransaction> = new Schema({
    userId: {
        type: Number,
        required: true,
    },
    bookName: {
        type: String,
        required: true,
    },
    issueDate: {
        type: Date,
        // required: true,
    },
    returnDate:{
        type:Date,
        // required:true
    },
    totalRent:{
        type:Number,
        default: 0,
        required:true
    }
}, { timestamps: true });

export const Transactions: Model<ITransaction> = mongoose.model<ITransaction>('Transactions', transactionsSchema);

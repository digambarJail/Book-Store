import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBook extends Document {
    bookName: string;
    category: string;
    rentPerDay: number;
}

const booksSchema: Schema<IBook> = new Schema({
    bookName: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    rentPerDay: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

export const Books: Model<IBook> = mongoose.model<IBook>('Books', booksSchema);

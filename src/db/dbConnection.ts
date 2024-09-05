import mongoose, { Mongoose } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = (): Promise<Mongoose> => {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.MONGODB_URI as string)
            .then((connectionInstance) => {
                console.log(`MongoDB Connected!!! HOST: ${connectionInstance.connection.host}`);
                resolve(connectionInstance);
            })
            .catch((error) => {
                console.error("Error connecting to MongoDB", error);
                reject(error);
            });
    });
}

export default connectDB;

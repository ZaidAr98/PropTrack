import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()
const dbUrl:string = process.env.MONGODB_URL as string;


const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;

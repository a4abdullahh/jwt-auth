import mongoose from 'mongoose';
import { MONGO_URI } from '../constants/env';

const connectToDatabase = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectToDatabase;

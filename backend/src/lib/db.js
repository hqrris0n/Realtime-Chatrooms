import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Env variable used to wait for a database connection
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};
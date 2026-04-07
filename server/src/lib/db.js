import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log('MongoDB connection successfull', conn.connection.host);
  } catch (error) {
    console.error('Error connecting to Mongo db ', error);
    process.exit(1);
  }
};

// config/database.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
  try {
    // Get MongoDB URI from the environment variables
    const mongoURI = process.env.DEV_MONGO_URI;
    console.log('Mongo', mongoURI)
 
    if (!mongoURI) {
      console.error('Mongo URI not defined in .env file!');
      process.exit(1); // Exit the application if URI is not defined
    }

    // Connect to MongoDB using Mongoose
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit the application on failure
  }
};

export default connectDB;

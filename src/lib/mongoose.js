import mongoose from "mongoose";

export async function mongooseConnect() {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection.asPromise();
    }
    
    // Check if currently connecting
    if (mongoose.connection.readyState === 2) {
      return mongoose.connection.asPromise();
    }

    const url = process.env.MONGODB_URL;
    if (!url) {
      throw new Error("MongoDB URL is not defined in environment variables");
    }

    // Only log URL in development
    if (process.env.NODE_ENV === 'development') {
      console.log("Connecting to MongoDB...");
    }

    return await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
}
// Connects to the MongoDB database
// Returns a promise that resolves when the connection is established
// Throws an error if the connection fails
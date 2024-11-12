import mongoose from 'mongoose';

export async function connectToDatabase() {
    try {
        if (mongoose.connection.readyState === 1) {
            // If already connected, return
            return;
        }
        
        if (!process.env.MONGO_URL) {
            throw new Error('MONGO_URL is not defined in environment variables');
        }

        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

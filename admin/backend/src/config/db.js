import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URL;
        if (!uri) {
            throw new Error("MONGODB_URL is not defined in environment");
        }
        await mongoose.connect(uri);
        console.log("✅ [Admin Backend] Connected to Main MongoDB Atlas successfully");
    } catch (err) {
        console.error("❌ [Admin Backend] MongoDB connection error:", err.message);
        process.exit(1);
    }
};

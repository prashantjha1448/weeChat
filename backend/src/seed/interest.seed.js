import 'dotenv/config';
import mongoose from 'mongoose';
import InterestModel from '../models/interest.model.js';
import { connectDB } from '../config/db.js';

/**
 * Seed Script — Initial Master Data Seeding for Interests, Languages & Countries
 * Standardized Build Order: Step 1
 */
const initialSeedData = [
    // --- INTEREST TAGS ---
    { type: "interest", name: "Coding & Tech", code: "interest_tech" },
    { type: "interest", name: "Gaming", code: "interest_gaming" },
    { type: "interest", name: "Music", code: "interest_music" },
    { type: "interest", name: "Movies & Shows", code: "interest_movies" },
    { type: "interest", name: "Travel & Adventure", code: "interest_travel" },
    { type: "interest", name: "Fitness & Gym", code: "interest_fitness" },
    { type: "interest", name: "Anime & Manga", code: "interest_anime" },
    { type: "interest", name: "Photography", code: "interest_photography" },

    // --- LANGUAGES ---
    { type: "language", name: "Hindi", code: "lang_hindi" },
    { type: "language", name: "English", code: "lang_english" },
    { type: "language", name: "Spanish", code: "lang_spanish" },
    { type: "language", name: "French", code: "lang_french" },
    { type: "language", name: "German", code: "lang_german" },

    // --- COUNTRIES ---
    { type: "country", name: "India", code: "country_in" },
    { type: "country", name: "United States", code: "country_us" },
    { type: "country", name: "United Kingdom", code: "country_uk" },
    { type: "country", name: "Canada", code: "country_ca" },
    { type: "country", name: "Australia", code: "country_au" }
];

export const seedInterests = async () => {
    try {
        console.log("🌱 Starting Master Data Seeding (Step 1)...");
        
        for (const item of initialSeedData) {
            await InterestModel.findOneAndUpdate(
                { code: item.code },
                { $set: item },
                { upsert: true, new: true }
            );
        }

        console.log("✅ Master Seeding Completed Successfully! (Interests, Languages, Countries)");
    } catch (error) {
        console.error("❌ Seeding Error:", error.message);
    }
};

// Execute if run directly from command line
if (process.argv[1] && process.argv[1].includes("interest.seed.js")) {
    connectDB().then(async () => {
        await seedInterests();
        mongoose.connection.close();
        process.exit(0);
    });
}

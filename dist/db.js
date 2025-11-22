"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // دي مهمة عشان يقرأ .env
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached = global.mongoose || { conn: null, promise: null };
const connectToDatabase = async (MONGODB_URI = process.env.MONGODB_URI) => {
    if (cached.conn) {
        console.log('✅ Using cached MongoDB connection');
        return cached.conn;
    }
    if (!MONGODB_URI)
        throw new Error('MONGODB_URI is missing');
    console.log('🔹 Connecting to MongoDB...');
    try {
        cached.promise = cached.promise || mongoose_1.default.connect(MONGODB_URI);
        cached.conn = await cached.promise;
        console.log('✅ Connected to MongoDB');
    }
    catch (err) {
        console.error('❌ Failed to connect to MongoDB:', err);
        throw err;
    }
    return cached.conn;
};
exports.connectToDatabase = connectToDatabase;

import mongoose from 'mongoose'
import dotenv from "dotenv";
dotenv.config();  // دي مهمة عشان يقرأ .env

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached = (global as any).mongoose || { conn: null, promise: null }

export const connectToDatabase = async (
  MONGODB_URI = process.env.MONGODB_URI
) => {
  if (cached.conn) {
    console.log('✅ Using cached MongoDB connection')
    return cached.conn
  }

  if (!MONGODB_URI) throw new Error('MONGODB_URI is missing')
  
  console.log('🔹 Connecting to MongoDB...')

  try {
    cached.promise = cached.promise || mongoose.connect(MONGODB_URI)
    cached.conn = await cached.promise
    console.log('✅ Connected to MongoDB')
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err)
    throw err
  }

  return cached.conn
}


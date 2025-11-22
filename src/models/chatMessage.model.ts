// lib/db/models/chatMessage.model.ts
import mongoose, { Schema, model, models, Document, Types } from "mongoose";

export interface IChatMessage extends Document {
  chatId: Types.ObjectId | string;
  sender: Types.ObjectId | string;
  text: string;
  type: "text" | "image" | "file" | "video" | "system";
  isRead: boolean;
  mediaUrl?: string;
  mediaName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    chatId: { 
      type: Schema.Types.ObjectId, 
      ref: "Chat", 
      required: true, 
      index: true 
    },
    sender: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    text: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["text", "image", "file", "video", "system"],
      default: "text" 
    },
    isRead: { type: Boolean, default: false },
    mediaUrl: { type: String },
    mediaName: { type: String },
  },
  { timestamps: true }
);

// Indexes for better performance
ChatMessageSchema.index({ chatId: 1, createdAt: -1 });
ChatMessageSchema.index({ sender: 1 });
ChatMessageSchema.index({ isRead: 1 });

export default models.ChatMessage || model<IChatMessage>("ChatMessage", ChatMessageSchema);

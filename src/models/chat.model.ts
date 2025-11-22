// lib/db/models/chat.model.ts
import mongoose, { Schema, model, models, Document, Types } from "mongoose";

export interface IChatMember {
  user: Types.ObjectId;
  isAdmin: boolean;
  joinedAt: Date;
  mutedUntil?: Date | null;
}

export interface IChat extends Document {
  members: IChatMember[];
  isGroup: boolean;
  groupInfo?: {
    name: string;
    photo?: string;
    description?: string;
    createdBy: Types.ObjectId;
  };
  lastMessage?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    members: [
      {
        user: { 
          type: Schema.Types.ObjectId, 
          ref: "User", 
          required: true 
        },
        isAdmin: { 
          type: Boolean, 
          default: false 
        },
        joinedAt: { 
          type: Date, 
          default: Date.now 
        },
        mutedUntil: { 
          type: Date, 
          default: null 
        },
      },
    ],
    isGroup: { 
      type: Boolean, 
      default: false 
    },
    groupInfo: {
      name: { type: String, trim: true },
      photo: { type: String },
      description: { type: String, trim: true },
      createdBy: { 
        type: Schema.Types.ObjectId, 
        ref: "User" 
      },
    },
    lastMessage: { 
      type: Schema.Types.ObjectId, 
      ref: "ChatMessage" 
    },
  },
  { timestamps: true }
);

// Indexes for better performance
ChatSchema.index({ "members.user": 1 });
ChatSchema.index({ isGroup: 1 });
ChatSchema.index({ updatedAt: -1 });
ChatSchema.index({ lastMessage: 1 });

export default models.Chat || model<IChat>("Chat", ChatSchema);

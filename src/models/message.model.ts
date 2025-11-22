
import mongoose, { Schema, model, models, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  storeId: string;
  senderName: string;
  senderEmail: string;
  message?: string;
  status: 'pending' | 'sent' | 'replied' | 'closed' | 'delivered' | 'read';
  reply?: string;
  chatId: Types.ObjectId;
  sender: Types.ObjectId;
  type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'location';
  text?: string;
  media?: {
    url?: string;
    thumbnailUrl?: string;
    size?: number;
    duration?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    // 🔹 معلومات المتجر (إن كانت رسائل خدمة عملاء)
    storeId: { type: String, required: true, index: true },

    // 🔹 بيانات المرسل (لو الزبون يرسل)
    senderName: { type: String, required: true, trim: true },
    senderEmail: { type: String, required: true, trim: true },

    // 🔹 الرسالة النصية (في حالة كان النوع text)
    message: { type: String, trim: true },

    // 🔹 حالة الرسالة
    status: {
      type: String,
      enum: ['pending', 'sent', 'replied', 'closed', 'delivered', 'read'],
      default: 'sent'
    },

    // 🔹 رد الوكيل / مالك المتجر
    reply: { type: String, trim: true },

    // 🔹 نظام المحادثات
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },

    // --------------------------
    // 🔹 أنواع الرسائل
    // --------------------------
    type: {
      type: String,
      enum: ['text', 'image', 'video', 'audio', 'file', 'location'],
      default: 'text'
    },

    text: { type: String, trim: true },

    media: {
      url: String,
      thumbnailUrl: String,
      size: Number,
      duration: Number
    },

  },
  { timestamps: true }
);

const Message = models.Message || model<IMessage>('Message', messageSchema);
export default Message;

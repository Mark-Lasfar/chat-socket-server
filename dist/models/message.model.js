"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
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
    chatId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
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
}, { timestamps: true });
const Message = mongoose_1.models.Message || (0, mongoose_1.model)('Message', messageSchema);
exports.default = Message;

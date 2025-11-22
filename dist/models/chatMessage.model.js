"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// lib/db/models/chatMessage.model.ts
const mongoose_1 = require("mongoose");
const ChatMessageSchema = new mongoose_1.Schema({
    chatId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
        index: true
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: true });
// Indexes for better performance
ChatMessageSchema.index({ chatId: 1, createdAt: -1 });
ChatMessageSchema.index({ sender: 1 });
ChatMessageSchema.index({ isRead: 1 });
exports.default = mongoose_1.models.ChatMessage || (0, mongoose_1.model)("ChatMessage", ChatMessageSchema);

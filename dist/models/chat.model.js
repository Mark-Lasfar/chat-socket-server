"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// lib/db/models/chat.model.ts
const mongoose_1 = require("mongoose");
const ChatSchema = new mongoose_1.Schema({
    members: [
        {
            user: {
                type: mongoose_1.Schema.Types.ObjectId,
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User"
        },
    },
    lastMessage: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "ChatMessage"
    },
}, { timestamps: true });
// Indexes for better performance
ChatSchema.index({ "members.user": 1 });
ChatSchema.index({ isGroup: 1 });
ChatSchema.index({ updatedAt: -1 });
ChatSchema.index({ lastMessage: 1 });
exports.default = mongoose_1.models.Chat || (0, mongoose_1.model)("Chat", ChatSchema);

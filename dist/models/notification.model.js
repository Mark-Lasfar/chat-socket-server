"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// /lib/db/models/notification.model.ts
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true },
    type: {
        type: String,
        required: true,
        enum: [
            'welcome',
            'order created',
            'order updated',
            'order fulfilled',
            'order cancelled',
            'order shipped',
            'order delivered',
            'order payment completed',
            'order shipment updated',
            'payment success',
            'payment failed',
            'product created',
            'product updated',
            'product deleted',
            'product published',
            'product unpublished',
            'product reviewed',
            'inventory updated',
            'customer created',
            'customer updated',
            'seller registered',
            'seller updated',
            'withdrawal created',
            'withdrawal updated',
            'tax transaction created',
            'campaign updated',
            'ad performance updated',
            'transaction recorded',
            'analytics updated',
            'automation triggered',
            'message sent',
            'course updated',
            'security alert',
            'account suspended',
            'profile updated',
            'settings updated',
            'document uploaded',
            'integration updated',
            'earnings distributed',
            'api_key created',
            'api_key rotated',
            'api_key deactivated',
            'points earned',
            'points updated',
            'trial reminder',
            'subscription expired',
            'cart updated',
            'cart update',
            'cart cleared',
            'promotion',
            'verification',
            'orderConfirmation',
            'passwordReset',
            'subscriptionConfirmation',
            'paymentFailure',
            'reset password',
            'subscription_updated',
        ],
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: mongoose_1.Schema.Types.Mixed },
    channels: {
        type: [String],
        enum: ['email', 'push', 'sms', 'in_app', 'whatsapp'],
        default: ['in_app'],
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium',
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'failed', 'read'],
        default: 'pending',
    },
    read: { type: Boolean, default: false },
    readAt: Date,
    expiresAt: Date,
    metadata: {
        browser: String,
        device: String,
        ip: String,
    },
}, {
    timestamps: true,
});
// Add methods to the schema
notificationSchema.methods.markAsRead = async function () {
    this.read = true;
    this.readAt = new Date();
    this.status = 'read';
    await this.save();
};
notificationSchema.methods.markAsSent = async function () {
    this.status = 'sent';
    await this.save();
};
// Add indexes
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ status: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const Notification = mongoose_1.models.Notification ||
    (0, mongoose_1.model)('Notification', notificationSchema);
exports.default = Notification;

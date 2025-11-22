"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/socket.ts
console.log("🟢 Socket.ts loaded BEFORE imports");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const db_1 = require("./db");
const chatMessage_model_1 = __importDefault(require("./models/chatMessage.model"));
const user_model_1 = __importDefault(require("./models/user.model"));
const chat_model_1 = __importDefault(require("./models/chat.model"));
const message_model_1 = __importDefault(require("./models/message.model"));
const notification_model_1 = __importDefault(require("./models/notification.model"));
const mongoose_1 = require("mongoose");
async function startServer() {
    console.log("🟢 Starting server...");
    try {
        await (0, db_1.connectToDatabase)();
        console.log("✅ Connected to MongoDB");
        const httpServer = (0, http_1.createServer)();
        const io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: process.env.CLIENT_URL || "http://localhost:3000",
                methods: ["GET", "POST"],
                credentials: true
            }
        });
        console.log("🟢 Socket.io Unified Server Running...");
        io.on("connection", (socket) => {
            console.log("📡 User connected:", socket.id);
            /** AUTHENTICATION & USER MANAGEMENT */
            socket.on("authenticate", async (userId) => {
                try {
                    socket.userId = userId;
                    socket.join(`user:${userId}`);
                    // تحديث حالة المستخدم إلى online
                    await user_model_1.default.findByIdAndUpdate(userId, {
                        chatStatus: "online",
                        lastSeen: new Date()
                    });
                    console.log(`👤 User ${userId} authenticated and joined user room`);
                    // إعلام جميع الاتصالات بتحديث الحالة
                    socket.broadcast.emit("user:status", {
                        userId,
                        status: "online",
                        lastSeen: new Date()
                    });
                }
                catch (error) {
                    console.error("Error in authenticate:", error);
                    socket.emit("auth:error", { error: "Authentication failed" });
                }
            });
            /** JOIN ROOMS */
            socket.on("join-user", (userId) => {
                socket.join(`user:${userId}`);
                console.log(`👤 Joined user room: user:${userId}`);
            });
            socket.on("join-store", (storeId) => {
                socket.join(`store:${storeId}`);
                console.log(`🏪 Joined store room: store:${storeId}`);
            });
            socket.on("join-chat", (chatId) => {
                socket.join(`chat:${chatId}`);
                console.log(`💬 Joined chat room: chat:${chatId}`);
            });
            /** REAL-TIME CHAT MESSAGES */
            socket.on("chat:message", async (data) => {
                try {
                    // التحقق من البيانات
                    if (!data.chatId || !data.senderId || !data.text) {
                        socket.emit("chat:error", { error: "Missing required fields" });
                        return;
                    }
                    // إنشاء الرسالة الجديدة
                    const newMessage = await chatMessage_model_1.default.create({
                        chatId: new mongoose_1.Types.ObjectId(data.chatId),
                        sender: new mongoose_1.Types.ObjectId(data.senderId),
                        text: data.text,
                        type: data.type || "text",
                        isRead: false
                    });
                    // تحديث آخر رسالة في الجروب
                    await chat_model_1.default.findByIdAndUpdate(data.chatId, {
                        lastMessage: newMessage._id,
                        updatedAt: new Date()
                    });
                    // جلب الرسالة مع بيانات المرسل
                    const populatedMessage = await chatMessage_model_1.default.findById(newMessage._id)
                        .populate("sender", "name username chatAvatar chatStatus")
                        .lean();
                    if (!populatedMessage) {
                        throw new Error("Failed to populate message");
                    }
                    // تحويل البيانات للتأكد من أن جميع الـ ObjectId أصبحت strings
                    const messageData = {
                        _id: populatedMessage._id.toString(),
                        chatId: populatedMessage.chatId.toString(),
                        sender: {
                            _id: populatedMessage.sender._id.toString(),
                            name: populatedMessage.sender.name,
                            username: populatedMessage.sender.username,
                            chatAvatar: populatedMessage.sender.chatAvatar,
                            chatStatus: populatedMessage.sender.chatStatus
                        },
                        text: populatedMessage.text,
                        type: populatedMessage.type,
                        isRead: populatedMessage.isRead,
                        createdAt: populatedMessage.createdAt,
                        updatedAt: populatedMessage.updatedAt
                    };
                    // إرسال الرسالة لجميع أعضاء الجروب
                    io.to(`chat:${data.chatId}`).emit("chat:new_message", messageData);
                    // إرسال إشعار للمستخدمين غير المتصلين
                    socket.to(`chat:${data.chatId}`).emit("chat:notification", {
                        chatId: data.chatId,
                        message: data.text,
                        sender: data.senderId
                    });
                    console.log(`💬 Message sent to chat ${data.chatId} by user ${data.senderId}`);
                }
                catch (error) {
                    console.error("Error sending chat message:", error);
                    socket.emit("chat:error", { error: error.message || "Failed to send message" });
                }
            });
            /** MESSAGE STATUS UPDATES */
            socket.on("messages:delivered", async (data) => {
                try {
                    if (!data.chatId || !data.messageIds?.length)
                        return;
                    // تحويل messageIds إلى ObjectId
                    const objectIds = data.messageIds.map(id => {
                        try {
                            return new mongoose_1.Types.ObjectId(id);
                        }
                        catch {
                            return null;
                        }
                    }).filter(Boolean);
                    if (objectIds.length === 0)
                        return;
                    // تحديث حالة الرسائل إلى "تم التسليم"
                    await chatMessage_model_1.default.updateMany({
                        _id: { $in: objectIds },
                        isRead: false
                    }, { $set: { isRead: true } });
                    // إعلام جميع الأعضاء بتحديث حالة الرسائل
                    io.to(`chat:${data.chatId}`).emit("messages:status_updated", {
                        chatId: data.chatId,
                        messageIds: data.messageIds,
                        status: "delivered",
                        updatedBy: socket.userId
                    });
                }
                catch (error) {
                    console.error("Error updating message status:", error);
                }
            });
            socket.on("messages:read", async (data) => {
                try {
                    if (!data.chatId || !data.messageIds?.length)
                        return;
                    // تحويل messageIds إلى ObjectId
                    const objectIds = data.messageIds.map(id => {
                        try {
                            return new mongoose_1.Types.ObjectId(id);
                        }
                        catch {
                            return null;
                        }
                    }).filter(Boolean);
                    if (objectIds.length === 0)
                        return;
                    // تحديث حالة الرسائل إلى "تم القراءة"
                    await chatMessage_model_1.default.updateMany({
                        _id: { $in: objectIds },
                        isRead: false
                    }, { $set: { isRead: true } });
                    // إعلام جميع الأعضاء بتحديث حالة الرسائل
                    io.to(`chat:${data.chatId}`).emit("messages:status_updated", {
                        chatId: data.chatId,
                        messageIds: data.messageIds,
                        status: "read",
                        updatedBy: socket.userId
                    });
                }
                catch (error) {
                    console.error("Error updating message status:", error);
                }
            });
            /** TYPING INDICATORS */
            socket.on("typing:start", (data) => {
                if (!data.chatId)
                    return;
                socket.to(`chat:${data.chatId}`).emit("typing:indicator", {
                    chatId: data.chatId,
                    userId: socket.userId,
                    userName: data.userName,
                    typing: true
                });
            });
            socket.on("typing:stop", (data) => {
                if (!data.chatId)
                    return;
                socket.to(`chat:${data.chatId}`).emit("typing:indicator", {
                    chatId: data.chatId,
                    userId: socket.userId,
                    userName: data.userName,
                    typing: false
                });
            });
            /** USER PRESENCE */
            socket.on("user:online", async (userId) => {
                try {
                    await user_model_1.default.findByIdAndUpdate(userId, {
                        chatStatus: "online",
                        lastSeen: new Date()
                    });
                    io.emit("presence:update", {
                        userId,
                        status: "online",
                        lastSeen: new Date()
                    });
                }
                catch (error) {
                    console.error("Error updating user online status:", error);
                }
            });
            socket.on("user:away", async (userId) => {
                try {
                    await user_model_1.default.findByIdAndUpdate(userId, {
                        chatStatus: "away",
                        lastSeen: new Date()
                    });
                    io.emit("presence:update", {
                        userId,
                        status: "away",
                        lastSeen: new Date()
                    });
                }
                catch (error) {
                    console.error("Error updating user away status:", error);
                }
            });
            /** GROUP CHAT FUNCTIONALITY */
            socket.on("group:join", async (data) => {
                try {
                    socket.join(`group:${data.groupId}`);
                    // إنشاء رسالة System عند الانضمام
                    const systemMsg = await message_model_1.default.create({
                        chatId: data.groupId,
                        type: "system",
                        text: `${data.userName} joined the group`,
                    });
                    io.to(`group:${data.groupId}`).emit("group:system", systemMsg);
                }
                catch (error) {
                    console.error("Error in group join:", error);
                }
            });
            socket.on("group:message", async (data) => {
                try {
                    const msg = await message_model_1.default.create({
                        chatId: data.groupId,
                        sender: data.sender,
                        type: data.type,
                        text: data.text,
                        media: data.media
                    });
                    io.to(`group:${data.groupId}`).emit("group:new", msg);
                }
                catch (error) {
                    console.error("Error sending group message:", error);
                }
            });
            /** NOTIFICATIONS */
            socket.on("send-notification", async (data) => {
                try {
                    const doc = await notification_model_1.default.create({
                        userId: data.userId,
                        title: data.title,
                        message: data.message,
                        type: data.type,
                        read: false,
                    });
                    io.to(`user:${data.userId}`).emit("notification", doc);
                }
                catch (error) {
                    console.error("Error sending notification:", error);
                }
            });
            /** DISCONNECTION HANDLING */
            socket.on("disconnect", async (reason) => {
                console.log("❌ User disconnected:", socket.id, "Reason:", reason);
                if (!socket.userId)
                    return;
                try {
                    // تحديث حالة المستخدم إلى offline
                    await user_model_1.default.findByIdAndUpdate(socket.userId, {
                        chatStatus: "offline",
                        lastSeen: new Date()
                    });
                    // إعلام جميع الاتصالات بتحديث الحالة
                    socket.broadcast.emit("user:status", {
                        userId: socket.userId,
                        status: "offline",
                        lastSeen: new Date()
                    });
                    // إرسال event حضور
                    io.emit("presence:update", {
                        userId: socket.userId,
                        status: "offline",
                        lastSeen: new Date()
                    });
                    console.log(`👤 User ${socket.userId} status updated to offline`);
                }
                catch (error) {
                    console.error("Error handling disconnect:", error);
                }
            });
            /** LEGACY EVENTS FOR BACKWARD COMPATIBILITY */
            socket.on("join", (chatId) => {
                socket.join(`chat:${chatId}`);
                console.log(`💬 Joined chat (short) room: chat:${chatId}`);
            });
            socket.on("send-chat", async (data) => {
                try {
                    const doc = await chatMessage_model_1.default.create({
                        chatId: data.chatId,
                        senderId: data.senderId,
                        receiverId: data.receiverId,
                        message: data.message,
                        type: "text",
                    });
                    io.to(`chat:${data.chatId}`).emit("chat:new", doc);
                }
                catch (error) {
                    console.error("Error in send-chat:", error);
                }
            });
            socket.on("typing", (data) => {
                io.to(`chat:${data.chatId}`).emit("typing", {
                    chatId: data.chatId,
                    from: data.from,
                    to: data.to,
                    typing: data.typing,
                });
            });
            socket.on("send-message", async (data) => {
                try {
                    const newMsg = await message_model_1.default.create({
                        chatId: data.chatId,
                        senderId: data.senderId,
                        message: data.message,
                    });
                    io.to(`chat:${data.chatId}`).emit("new-message", newMsg);
                }
                catch (error) {
                    console.error("Error in send-message:", error);
                }
            });
        });
        const PORT = process.env.PORT || 3001;
        httpServer.listen(PORT, () => {
            console.log(`🚀 Socket server running on port ${PORT}`);
            console.log(`🌐 Client URL: ${process.env.CLIENT_URL || "http://localhost:3000"}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}
// معالجة الأخطاء الغير متوقعة
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
startServer();

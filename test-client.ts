import io from "socket.io-client";  // ✅ يعمل مع معظم الإصدارات الحديثة

// وصل بالـ Socket server
const socket = io("http://localhost:3001");

// بيانات وهمية للتجربة
const userId = "test-user-id";  
const chatId = "test-chat-id";  

socket.on("connect", () => {
  console.log("✅ Connected to socket server:", socket.id);

  // تجربة authenticate بالمستخدم الوهمي
  socket.emit("authenticate", userId);

  // تجربة إرسال رسالة ترحيبية
  socket.emit("chat:message", {
    chatId,
    senderId: userId,
    text: "👋 Hello! This is a test welcome message!"
  });
});

// استقبال الرسائل الجديدة
socket.on("chat:new_message", (msg: any) => {
  console.log("💬 New message received:", msg);
});

// أي أخطاء في التوثيق
socket.on("auth:error", (err: any) => {
  console.error("Authentication error:", err);
});

// Optional: استقبال إشعارات جديدة
socket.on("chat:notification", (notification: any) => {
  console.log("🔔 Notification received:", notification);
});


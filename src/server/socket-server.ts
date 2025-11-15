import express, { Application } from "express";
import http from "http";
import { Server } from "socket.io";
import cron from "node-cron";
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";

// Fix ESM __dirname for TypeScript
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase Admin Initialization
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_ADMIN_KEY as string)
    ),
  });
}

const app: Application = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// When user connects
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Firestore reference
const db = admin.firestore();

// Cron job — runs every minute
cron.schedule("* * * * *", async () => {
  console.log("Cron Running...");

  const now = new Date();

  const snapshot = await db
    .collection("notifications")
    .where("scheduledTime", "<=", now)
    .where("sent", "==", false)
    .get();

  snapshot.forEach(async (doc) => {
    const data = doc.data();

    // Send Notification to all connected users
    io.emit("notification", {
      message: data.message,
      scheduledTime: data.scheduledTime,
    });

    // Mark as sent
    await doc.ref.update({ sent: true });
  });
});

const PORT = process.env.SOCKET_PORT || 4000;

server.listen(PORT, () =>
  console.log(`🔥 Socket.IO Server Running on port ${PORT}`)
);

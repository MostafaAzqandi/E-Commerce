import app from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import redisClient from "./configs/redis.js";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

dotenv.config();
const PORT = process.env.APP_PORT || 5000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

global.io = io;
export const userSocketMap = new Map();

io.use((socket, next) => {
  const rawCookies = socket.handshake.headers.cookie;

  if (!rawCookies) {
    return next(new Error("Authentication error: Cookies missing"));
  }

  const cookies = Object.fromEntries(
    rawCookies.split("; ").map((c) => {
      const [key, ...v] = c.split("=");
      return [key, v.join("=")];
    }),
  );

  const token = cookies.jwt;

  if (!token) {
    return next(new Error("Authentication error: JWT cookie not found"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    return next(new Error("Authentication error: Invalid or expired token"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.user?.userId;

  if (!userId) {
    console.error(
      "Auth Error: Could not find userId inside payload structure.",
    );
    socket.disconnect(true);
    return;
  }

  const userIdStr = userId.toString();
  console.log(`🔌 Secure client connected: ${socket.id} (User: ${userIdStr})`);

  userSocketMap.set(userIdStr, socket.id);
  socket.join(userIdStr);

  socket.on("disconnect", (r) => {
    userSocketMap.delete(userIdStr);
    console.log(`❌ User ${userIdStr} disconnected: ${r}`);
  });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB successfully.");

    await redisClient.connect();

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();

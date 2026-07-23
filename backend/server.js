import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import adminRoutes from "./routes/admin.routes.js";
import authroute from "./routes/route.auth.js";
import quizroute from "./routes/route.quiz.js";
import contactRoute from "./routes/contact.js";
import dashboardRoutes from "./routes/route.dashboard.js";
import chatRoutes from "./routes/route.chatbot.js";
import examAIRoutes from "./routes/route.examAI.js";
import proctorRoutes from "./routes/route.proctor.js";
import teacherRoutes from "./routes/route.teacher.js"; // ✅ NEW
import questionRoutes from "./routes/route.question.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

console.log("HF KEY:", process.env.HF_API_KEY);

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
  : ["http://localhost:5173"];

console.log(process.env.CLIENT_URL);

// =====================================================
// Middleware
// =====================================================

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// =====================================================
// Routes
// =====================================================
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authroute);
app.use("/api/quiz", quizroute);
app.use("/api/contact", contactRoute);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/exam-ai", examAIRoutes);
app.use("/api/proctor", proctorRoutes);
app.use("/api/teacher", teacherRoutes); // ✅ NEW
app.use("/api/question", questionRoutes);

// =====================================================
// MongoDB
// =====================================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

// =====================================================
// Socket.IO
// =====================================================

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Socket Connected:", socket.id);

  socket.on("tab-switch", (payload) => {
    console.log("⚠️ Tab Switch:", {
      socketId: socket.id,
      reason: payload?.reason,
      time: new Date(),
    });
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket Disconnected:", socket.id);
  });
});

// =====================================================
// Global Error Handler
// =====================================================

app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// =====================================================
// Server
// =====================================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server Running on Port ${PORT}`);
});
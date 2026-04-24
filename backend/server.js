import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authroute from './routes/route.auth.js';
import quizroute from './routes/route.quiz.js';
import contactRoute from './routes/contact.js';
import dashboardRoutes from './routes/route.dashboard.js';
import chatRoutes from './routes/route.chatbot.js';

dotenv.config();
const app = express();
const server = http.createServer(app);
console.log("HF KEY:", process.env.HF_API_KEY);
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',')
  : ['http://localhost:5173'];
console.log(process.env.CLIENT_URL);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authroute);
app.use('/api/quiz', quizroute);
app.use('/api/contact', contactRoute);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chat',chatRoutes);
// app.post("/api/chat", async (req, res) => {
//   const { message } = req.body;

//   try {
//     const model = genAI.getGenerativeModel({
//       model: "gemini-3-flash-preview", // ✅ fast + free
//     });

//     const prompt = `
// You are a UPSC mentor.

// Rules:
// - Answer in bullet points
// - Keep it concise
// - Add examples
// - Make it exam-oriented

// Question: ${message}
// `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;

//     res.json({
//       reply: response.text(),
//     });
//   } catch (err) {
//     console.error("Gemini error:", err.message);

//     res.status(500).json({
//       reply: "⚠️ Gemini AI failed. Try again.",
//     });
//   }
// });

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo error:', err));

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', socket => {
  console.log('🟢 Socket connected:', socket.id);

  // 🔥 TAB SWITCH / PROCTOR EVENT
  socket.on('tab-switch', payload => {
    console.log('⚠️ Tab switch detected:', {
      socketId: socket.id,
      reason: payload?.reason,
      time: new Date(),
    });

    // 👉 future use:
    // - mark attempt suspicious
    // - auto submit quiz
    // - log violation
  });

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id);
  });
});

// ✅ GLOBAL ERROR HANDLER (SAFE)
app.use((err, req, res, next) => {
  console.error('Global error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

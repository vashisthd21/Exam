import express from "express";
import Chat from "../models/model.Chat.js";
import QuizAttempt from "../models/model.quizAttempt.js";
import auth from "../middleware/authmiddleware.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", auth, async (req, res) => {
  const { message } = req.body;
  const userId = req.user._id;

  try {
    // 🔹 Fetch user performance dynamically
    const attempts = await QuizAttempt.find({ userId });

    const total = attempts.length;
    const avgAccuracy =
      total === 0
        ? 0
        : Math.round(
            attempts.reduce((a, b) => a + b.accuracy, 0) / total
          );

    const topicStats = {};

attempts.forEach(a => {
  a.responses.forEach(r => {
    if (!r.isCorrect) {
      topicStats[r.topic] = (topicStats[r.topic] || 0) + 1;
    }
  });
});

const weakAreas = Object.keys(topicStats)
  .sort((a, b) => topicStats[b] - topicStats[a])
  .slice(0, 2)
  .join(", ");

    // 🔹 Get previous chat
    let chat = await Chat.findOne({ userId });

    if (!chat) {
      chat = new Chat({ userId, messages: [] });
    }

    // 🔹 Add user message
    chat.messages.push({ role: "user", content: message });

    // 🔹 Limit context
    const context = chat.messages.slice(-6);

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const prompt = `
You are a UPSC expert mentor.

User Performance:
- Accuracy: ${avgAccuracy}%
- Weak Areas: ${weakAreas}

Instructions:
- Answer in bullet points
- Use headings
- Give examples
- Keep it exam-oriented
- If topic is weak → explain from basics

Conversation:
${context.map(m => `${m.role}: ${m.content}`).join("\n")}

User Question: ${message}
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    // 🔹 Save response
    chat.messages.push({ role: "bot", content: reply });
    await chat.save();

    res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ reply: "AI error" });
  }
});

export default router;
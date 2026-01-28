import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    selectedOption: {
      type: Number, // index: 0–3
      required: true,
    },
  },
  { _id: false }
);

const quizAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  quizType: {
    type: String,
    required: true,
  },

  totalQuestions: {
    type: Number,
    required: true,
  },

  score: {
    type: Number,
    required: true,
  },

  accuracy: {
    type: Number,
    required: true,
  },

  timeTaken: {
    type: Number, // seconds
    required: true,
  },

  responses: [responseSchema], // ✅ ONLY questionId + answer

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('QuizAttempt', quizAttemptSchema);

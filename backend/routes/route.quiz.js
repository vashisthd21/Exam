import express from 'express';
const router = express.Router();

import {
  getQuestions,
  submitQuiz,
  getQuizAttemptById
} from '../controllers/controller.quiz.js';

import authMiddleware from '../middleware/authmiddleware.js';

/* ================= QUIZ ROUTES ================= */

// Start quiz (fetch questions)
router.get('/start', authMiddleware, getQuestions);

// Submit quiz
router.post('/submit', authMiddleware, submitQuiz);

// 🔥 Get quiz attempt with explanation (NEW)
router.get(
  '/attempt/:attemptId',
  authMiddleware,
  getQuizAttemptById
);

export default router;

import express from 'express';
const router = express.Router();
import {
  getQuestions,
  submitQuiz,
  getQuizAttemptById,
  getPublishedExams,
  getStudentExamById,
  submitStudentExam,
  getStudentExamAttemptById
} from "../controllers/controller.quiz.js";

import authMiddleware from '../middleware/authmiddleware.js';

/* ================= QUIZ ROUTES ================= */

// Start quiz (fetch questions)
router.get(
  "/student/exams",
  authMiddleware,
  getPublishedExams
);
router.get(
  "/student/exam/:id",
  authMiddleware,
  getStudentExamById
);
router.get('/start', authMiddleware, getQuestions);

// Submit quiz
router.post('/submit', authMiddleware, submitQuiz);

// 🔥 Get quiz attempt with explanation (NEW)
router.get(
  '/attempt/:attemptId',
  authMiddleware,
  getQuizAttemptById
);
router.post(
  "/student/exam/:id/submit",
  authMiddleware,
  submitStudentExam
);
router.get(
  "/student/attempt/:attemptId",
  authMiddleware,
  getStudentExamAttemptById
  );
export default router;

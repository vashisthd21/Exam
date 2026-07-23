import express from "express";

import authMiddleware from "../middleware/authmiddleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

import {
    createQuestion,
    getQuestions,
    getQuestion,
    updateQuestion,
    deleteQuestion,
    generateQuestions,
    attachQuestionsToExam,
} from "../controllers/controller.question.js";

const router = express.Router();

// ====================================================
// Dashboard Question Bank
// ====================================================

// Create Manual Question
router.post(
    "/",
    authMiddleware,
    roleMiddleware("teacher"),
    createQuestion
);

// Get All Questions
router.get(
    "/",
    authMiddleware,
    roleMiddleware("teacher"),
    getQuestions
);

// Get Single Question
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("teacher"),
    getQuestion
);

// Update Question
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("teacher"),
    updateQuestion
);

// Delete Question
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("teacher"),
    deleteQuestion
);

// ====================================================
// AI Question Generation
// ====================================================

// Generate AI Questions
router.post(
    "/generate",
    authMiddleware,
    roleMiddleware("teacher"),
    generateQuestions
);

// Attach Questions to Exam
router.post(
    "/attach",
    authMiddleware,
    roleMiddleware("teacher"),
    attachQuestionsToExam
);

export default router;
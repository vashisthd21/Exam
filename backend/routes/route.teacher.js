import express from "express";

import authMiddleware from "../middleware/authmiddleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

import {
    teacherDashboard,
    createExam,
    getAllExams,
    getExamById,
    deleteExam,
    publishExam,
    unpublishExam,
    generateQuestionsForExam,
} from "../controllers/controller.teacher.js";

const router = express.Router();


// ==========================================
// Dashboard
// ==========================================

router.get(
    "/dashboard",
    authMiddleware,
    roleMiddleware("teacher"),
    teacherDashboard
);


// ==========================================
// Create Exam
// ==========================================

router.post(
    "/exam",
    authMiddleware,
    roleMiddleware("teacher"),
    createExam
);


// ==========================================
// Get All Exams
// ==========================================

router.get(
    "/exams",
    authMiddleware,
    roleMiddleware("teacher"),
    getAllExams
);


// ==========================================
// Get Single Exam
// ==========================================

router.get(
    "/exam/:id",
    authMiddleware,
    roleMiddleware("teacher"),
    getExamById
);


// ==========================================
// Delete Exam
// ==========================================

router.delete(
    "/exam/:id",
    authMiddleware,
    roleMiddleware("teacher"),
    deleteExam
);


// ==========================================
// Publish Exam
// ==========================================

router.patch(
    "/exam/publish/:id",
    authMiddleware,
    roleMiddleware("teacher"),
    publishExam
);


// ==========================================
// Unpublish Exam
// ==========================================

router.patch(
    "/exam/unpublish/:id",
    authMiddleware,
    roleMiddleware("teacher"),
    unpublishExam
);

router.post(
    "/exam/:examId/generate",
    authMiddleware,
    roleMiddleware("teacher"),
    generateQuestionsForExam
);

export default router;
import express from 'express';
import ExamAttempt from '../models/model.examAttempt.js';
import auth from '../middleware/authmiddleware.js';

const router = express.Router();

router.get('/stats', auth, async (req, res) => {
  try {
    // FIX 1: Change userId to 'student' to match your ExamAttempt schema, and populate exam details
    const attempts = await ExamAttempt.find({ student: req.user._id })
      .populate('exam', 'title subject topic')
      .sort({ createdAt: -1 });
    console.log(attempts);
    const total = attempts.length;
    
    const avgAccuracy =
      total === 0
        ? 0
        : Math.round(
            attempts.reduce((acc, curr) => acc + (curr.accuracy || 0), 0) / total
          );

    // Format recent attempts to match what your student dashboard frontend expects
    const formattedRecent = attempts.slice(0, 5).map((a) => ({
      _id: a._id,
      quizType: a.exam?.title || "Exam Assessment",
      score: a.score,
      totalQuestions: a.totalQuestions,
      accuracy: a.accuracy,
      createdAt: a.createdAt,
    }));

    res.json({
      totalAttempts: total,
      avgAccuracy,
      recent: formattedRecent,
    });
  } catch (err) {
    console.error("Failed to fetch dashboard stats:", err);
    res.status(500).json({ message: "Server error while fetching stats" });
  }
});

export default router;
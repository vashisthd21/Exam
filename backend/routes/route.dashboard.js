import express from 'express';
import QuizAttempt from '../models/model.quizAttempt.js';
import auth from '../middleware/authmiddleware.js';

const router = express.Router();

router.get('/stats', auth, async (req, res) => {

  // console.log(req);
  // console.log(req.user._id);
  const attempts = await QuizAttempt.find({ userId: req.user._id });
  console.log(attempts);
  const total = attempts.length;
  const avgAccuracy =
    total === 0
      ? 0
      : Math.round(
          attempts.reduce((a, b) => a + b.accuracy, 0) / total
        );

  res.json({
    totalAttempts: total,
    avgAccuracy,
    recent: attempts.slice(-5).reverse(),
  });
});

export default router;

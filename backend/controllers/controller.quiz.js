import Question from '../models/model.quiz.js';
import User from '../models/model.user.js';
import QuizAttempt from '../models/model.quizAttempt.js';

/* ===========================
   GET QUESTIONS
=========================== */
const getQuestions = async (req, res) => {
  const { quizType } = req.query;

  try {
    const questions = await Question.find()
      .select('-answer -explanation') // 🔒 NEVER send answer/explanation
      .lean();

    if (!questions.length) {
      return res.status(404).json({ message: 'No quiz data found' });
    }

    let selectedQuestions = [];

    if (quizType === '20') {
      selectedQuestions = getRandomQuestions(questions, 20);
      return res.json(selectedQuestions);
    }

    if (quizType === '30') {
      selectedQuestions = getRandomQuestions(questions, 30);
      return res.json(selectedQuestions);
    }

    if (quizType === 'subject') {
      const grouped = questions.reduce((acc, q) => {
        if (!acc[q.subject]) acc[q.subject] = [];
        acc[q.subject].push(q);
        return acc;
      }, {});
      return res.json(grouped);
    }

    return res.status(400).json({ message: 'Invalid quiz type' });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Quiz fetching failed' });
  }
};

const getRandomQuestions = (questions, count) => {
  return [...questions].sort(() => Math.random() - 0.5).slice(0, count);
};
const submitQuiz = async (req, res) => {
  try {
    const { answers, quizType, timeTaken, totalQuestions } = req.body;
    const userId = req.user._id;

    if (!answers || !answers.length) {
      return res.status(400).json({ message: 'No answers submitted' });
    }

    const questionIds = answers.map(a => a.qid);

    const questions = await Question.find({
      _id: { $in: questionIds },
    }).select('answer').lean();

    const answerMap = {};
    questions.forEach(q => {
      answerMap[q._id.toString()] = q.answer;
    });

    let score = 0;
    const responses = [];

    answers.forEach(({ qid, answer }) => {
      const correctIndex = answerMap[qid];
      if (correctIndex === undefined) return;

      if (correctIndex === answer) {
        score++;
      }

      responses.push({
        questionId: qid,
        selectedOption: answer,
      });
    });

    const accuracy =
      totalQuestions > 0
        ? Math.round((score / totalQuestions) * 100)
        : 0;

    /* ================= SAVE ATTEMPT ================= */
    const attempt = await QuizAttempt.create({
      userId,
      quizType,
      totalQuestions,
      score,
      accuracy,
      timeTaken,
      responses, // ✅ stored as per schema
    });

    /* ================= UPDATE USER ================= */
    await User.findByIdAndUpdate(userId, {
      $inc: { totalScore: score },
      $set: { quizSubmitted: true, quizScore: score },
    });

    /* ================= RESPONSE ================= */
    return res.json({
      attemptId: attempt._id,
      score,
      totalQuestions,
      accuracy,
      timeTaken,
      quizType,
      createdAt: attempt.createdAt,
    });
  } catch (error) {
    console.error('💥 Submit quiz error:', error);
    return res.status(500).json({ message: 'Error submitting quiz' });
  }
};
const getQuizAttemptById = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const userId = req.user._id;

    const attempt = await QuizAttempt.findOne({
      _id: attemptId,
      userId,
    })
      .populate({
        path: 'responses.questionId',
        select:
          'question options answer explanation subject year tags',
      })
      .lean();

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    const analysis = attempt.responses.map(r => {
      const q = r.questionId;

      return {
        question: q.question,
        options: q.options,
        correctAnswer: q.answer,
        userAnswer: r.selectedOption,
        isCorrect: q.answer === r.selectedOption,
        explanation: q.explanation,
        subject: q.subject,
        year: q.year,
        tags: q.tags,
      };
    });

    return res.json({
      attemptId: attempt._id,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      accuracy: attempt.accuracy,
      quizType: attempt.quizType,
      timeTaken: attempt.timeTaken,
      createdAt: attempt.createdAt,
      analysis,
    });
  } catch (error) {
    console.error('Get attempt error:', error);
    res.status(500).json({ message: 'Failed to load analysis' });
  }
};

export {
  getQuestions,
  submitQuiz,
  getQuizAttemptById
};

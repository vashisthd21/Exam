import Question from '../models/model.quiz.js';
import User from '../models/model.user.js';
const getQuestions = async (req, res) => {
  const { quizType } = req.query; // Get quizType from query params (20, 30, subject)

  try {
    const questions = await Question.find().lean();

    if (!questions.length) {
      return res.status(404).json({ message: 'No quiz data found' });
    }

    // Handle the different quiz types
    let selectedQuestions = [];

    if (quizType === '20') {
      // Select 20 random questions
      selectedQuestions = getRandomQuestions(questions, 20);
    } else if (quizType === '30') {
      // Select 30 random questions
      selectedQuestions = getRandomQuestions(questions, 30);
    } else if (quizType === 'subject') {
      // Group by subject as before
      const grouped = questions.reduce((acc, q) => {
        if (!acc[q.subject]) acc[q.subject] = [];
        acc[q.subject].push({
          _id: q._id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
        });
        return acc;
      }, {});
      return res.json(grouped);  // Send the grouped response for subject-wise quiz
    } else {
      return res.status(400).json({ message: 'Invalid quiz type specified' });
    }

    // Return selected questions based on quiz type (20 or 30 questions)
    res.json(selectedQuestions);
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    res.status(500).json({ message: 'Quiz fetching failed', error: error.message });
  }
};

// Helper function to select random questions
const getRandomQuestions = (questions, count) => {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
const submitQuiz = async (req, res) => {
  const { answers } = req.body;
  // if (!req.user || !req.user.id) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }
  try {
    // Check if user already submitted quiz
    const user = await User.findById(req.user.id);
    // if (user.quizSubmitted) {
    //   return res.status(400).json({ message: 'You have already submitted the quiz', score: user.quizScore });
    // }

    // Fetch all questions
    const questions = await Question.find().lean();
    if (!questions.length) return res.status(404).json({ message: 'Quiz not found' });

    let score = 0;
    for (let submitted of answers) {
      const actual = questions.find(q => q._id.toString() === submitted.qid);
      if (!actual) continue;

      const correctAnswer = actual.options[actual.answer];
      const submittedAnswer = submitted.answer;

      if (correctAnswer.toString().trim().toLowerCase() === submittedAnswer.toString().trim().toLowerCase()) {
        score++;
      }
    }

    // Update user document
    user.quizSubmitted = true;
    user.quizScore = score;
    await user.save();

    res.json({ message: 'Quiz submitted successfully', score });
  } catch (error) {
    console.error('💥 Error in submitQuiz:', error);
    res.status(500).json({ message: 'Error in submitting quiz', error: error.message });
  }
};


export {
    getQuestions,
    submitQuiz
};
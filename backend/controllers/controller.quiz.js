import Question from '../models/model.quiz.js';
import User from '../models/model.user.js';
const getQuestions = async (req, res) => {
  const { quizType } = req.query; 

  try {
    const questions = await Question.find().lean();

    if (!questions.length) {
      return res.status(404).json({ message: 'No quiz data found' });
    }

    let selectedQuestions = [];

    if (quizType === '20') {
      // Select 20 random questions
      selectedQuestions = getRandomQuestions(questions, 20);
    } else if (quizType === '30') {
      // Select 30 random questions
      selectedQuestions = getRandomQuestions(questions, 30);
    } else if (quizType === 'subject') {
      // Group by subject 
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
      return res.json(grouped); 
    } else {
      return res.status(400).json({ message: 'Invalid quiz type specified' });
    }

    res.json(selectedQuestions);
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    res.status(500).json({ message: 'Quiz fetching failed', error: error.message });
  }
};

const getRandomQuestions = (questions, count) => {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
const submitQuiz = async (req, res) => {
  const { answers } = req.body;
  
  try {
    const user = await User.findById(req.user.id);
    // if (user.quizSubmitted) {
    //   return res.status(400).json({ message: 'You have already submitted the quiz', score: user.quizScore });
    // } // this part of code is giving error, so commenting it out for now

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
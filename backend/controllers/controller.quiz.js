import Question from '../models/model.quiz.js';

const getQuestions = async (req, res) => {
    try {
        const subjects = ['Math', "Science", 'English'];
        const quiz = {};

        for( const subject of subjects) {
            quiz[subject] = await Question.find({ subject }).limit(3);

        }
        res.json(quiz);
    } catch (error) {
        console.error('Error fetching quiz questions:', error);
        res.status(500).json({message: 'Quiz fetching failed'});
    }
};

const submitQuiz = async (req, res) => {
  try {
    const { userId, answers } = req.body;
    let score = 0;

    for (let submitted of answers) {
      const question = await Question.findById(submitted.questionId);

      if (question && question.answer === submitted.selectedOption) {
        score++;
      }
    }

    return res.status(200).json({
      message: "Quiz submitted successfully",
      score,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


export {getQuestions, submitQuiz};
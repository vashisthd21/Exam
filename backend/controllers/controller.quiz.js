import Question from '../models/model.quiz.js';

const getQuestions = async (req, res) => {
    try {
        const subjects = ['Math', "Science", 'English'];
        const quiz = {};

        for( const subject of subjects) {
            quiz[subject] = await Question.find({ subject }).limit(5);

        }
        res.json(quiz);
    } catch (error) {
        console.error('Error fetching quiz questions:', error);
        res.status(500).json({message: 'Quiz fetching failed'});
    }
};
const submitQuiz = async (req, res) => {
    const { answers } = req.body;
    let score = 0;

    try {
        for (let submitted of answers) {
            const actual = await Question.findById(submitted.qid);
            if (actual && actual.answer === submitted.answer) {
                score++;
            }
        }

        return res.json({ message: 'Quiz submitted successfully', score });
    } catch (error) {
        console.error("Error submitting quiz:", error);
        return res.status(500).json({ message: 'Error in submitting quiz', error: error.message });
    }
};

export {
    getQuestions,
    submitQuiz
};
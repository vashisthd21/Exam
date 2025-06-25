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

const submitQuiz = async(req, res) => {
    const {answers} = req.body;
    let score = 0;

    try{
        for(let submitted of answers) {
            const q = await Question.findOne({subject: submitted.subject});
            const actual = await Question.findOne(q.qid === submitted.subject);     //COULD BE SOME BUG
            if(actual && actual.answer === submitted.answer) {
                score++;
            }
        }
        res.json({message: 'Quiz submitted suzzesfully', score: score});
    }
    catch (e) {
        return res.json({message: 'Error in submitting quiz',error: e.message});
    }
}
export default getQuestions;
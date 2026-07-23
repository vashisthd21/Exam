import * as QuestionService from "../services/question.service.js";

// -----------------------------------------------------
// Create Manual Question
// -----------------------------------------------------

export const createQuestion = async (req, res) => {

    try {

        const question = await QuestionService.createQuestion(

            req.user._id,

            req.body

        );

        return res.status(201).json({

            success: true,

            message: "Question created successfully.",

            question,

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// -----------------------------------------------------
// Get All Questions
// -----------------------------------------------------

export const getQuestions = async (req, res) => {

    try {

        const questions = await QuestionService.getQuestions(

            req.user._id,

            req.query

        );

        return res.json({

            success: true,

            total: questions.length,

            questions,

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// -----------------------------------------------------
// Get Single Question
// -----------------------------------------------------

export const getQuestion = async (req, res) => {

    try {

        const question = await QuestionService.getQuestionById(

            req.params.id

        );

        if (!question) {

            return res.status(404).json({

                success: false,

                message: "Question not found.",

            });

        }

        return res.json({

            success: true,

            question,

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// -----------------------------------------------------
// Update Question
// -----------------------------------------------------

export const updateQuestion = async (req, res) => {

    try {

        const question = await QuestionService.updateQuestion(

            req.params.id,

            req.body

        );

        return res.json({

            success: true,

            message: "Question updated successfully.",

            question,

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// -----------------------------------------------------
// Delete Question
// -----------------------------------------------------

export const deleteQuestion = async (req, res) => {

    try {

        await QuestionService.deleteQuestion(

            req.params.id

        );

        return res.json({

            success: true,

            message: "Question deleted successfully.",

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// -----------------------------------------------------
// AI Generate Questions
// -----------------------------------------------------

export const generateQuestions = async (req, res) => {

    try {

        const questions = await QuestionService.generateAIQuestions(

            req.user._id,

            req.body

        );

        return res.status(201).json({

            success: true,

            total: questions.length,

            message: "AI questions generated successfully.",

            questions,

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// -----------------------------------------------------
// Attach Questions To Exam
// -----------------------------------------------------

export const attachQuestionsToExam = async (req, res) => {

    try {

        const { examId, questionIds } = req.body;

        const exam = await QuestionService.addQuestionsToExam(

            examId,

            questionIds

        );

        return res.json({

            success: true,

            message: "Questions added to exam successfully.",

            exam,

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};
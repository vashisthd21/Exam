import Question from "../models/model.question.js";
import Exam from "../models/model.exam.js";

// Import your existing AI Agents
import generateQuestions from "../ai/agents/ExamGeneratorAgent.js";
import verifyQuestions from "../ai/agents/AnswerVerificationAgent.js";

// ---------------------------------------------------
// Create Manual Question
// ---------------------------------------------------

export const createQuestion = async (teacherId, data) => {

    const question = await Question.create({

        ...data,

        createdBy: teacherId,

        generatedByAI: false,

        reviewed: true,

    });

    return question;

};

// ---------------------------------------------------
// Get All Questions
// ---------------------------------------------------

export const getQuestions = async (teacherId, filters = {}) => {

    const query = {

        createdBy: teacherId,

    };

    if (filters.subject)

        query.subject = filters.subject;

    if (filters.topic)

        query.topic = filters.topic;

    if (filters.difficulty)

        query.difficulty = filters.difficulty;

    return await Question.find(query)
        .sort({ createdAt: -1 });

};

// ---------------------------------------------------
// Get Single Question
// ---------------------------------------------------

export const getQuestionById = async (id) => {

    return await Question.findById(id);

};

// ---------------------------------------------------
// Update Question
// ---------------------------------------------------

export const updateQuestion = async (id, data) => {

    return await Question.findByIdAndUpdate(

        id,

        data,

        {

            new: true,

        }

    );

};

// ---------------------------------------------------
// Soft Delete Question
// ---------------------------------------------------

export const deleteQuestion = async (id) => {

    return await Question.findByIdAndDelete(id);

};

// ---------------------------------------------------
// Generate AI Questions
// ---------------------------------------------------

export const generateAIQuestions = async (
    teacherId,
    data
) => {

    //-------------------------------------
    // Generate + Verify + Quality Check
    //-------------------------------------

    const result = await ExamGeneratorAgent.generate(data);

    //-------------------------------------
    // Save Questions
    //-------------------------------------

    const savedQuestions = [];

    for (const q of result.questions) {

        const question = await Question.create({

            question: q.question,

            options: q.options,

            answer: q.answer,

            explanation: q.explanation,

            subject: data.subject,

            topic: data.topic,

            subTopic: q.subTopic || "",

            conceptSummary: q.conceptSummary || "",

            difficulty: data.difficulty,

            year: data.year || new Date().getFullYear(),

            exam: data.exam || "AI Generated",

            tags: q.tags || [],

            generatedByAI: true,

            reviewed: q.approved || false,

            createdBy: teacherId,

        });

        savedQuestions.push(question);

    }

    //-------------------------------------
    // Return Questions + Statistics
    //-------------------------------------

    return {

        questions: savedQuestions,

        stats: result.stats,

    };

};

// ---------------------------------------------------
// Attach Questions To Exam
// ---------------------------------------------------

export const addQuestionsToExam = async (

    examId,

    questionIds

) => {

    const exam = await Exam.findById(examId);

    if (!exam)

        throw new Error("Exam not found.");

    exam.questions.push(...questionIds);

    await exam.save();

    return exam;

};
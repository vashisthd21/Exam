import Exam from "../models/model.exam.js";
import Question from "../models/model.question.js";
import ExamGeneratorAgent from "../ai/agents/ExamGeneratorAgent.js";

// =====================================================
// Generate AI Questions For Exam
// =====================================================

export const generateExamQuestions = async (
    examId,
    teacherId,
    data
) => {

    //---------------------------------------
    // Find Exam
    //---------------------------------------

    const exam = await Exam.findById(examId);

    if (!exam) {
        throw new Error("Exam not found.");
    }

    //---------------------------------------
    // Check Ownership
    //---------------------------------------

    if (exam.teacher.toString() !== teacherId.toString()) {
        throw new Error("Unauthorized.");
    }

    //---------------------------------------
    // AI Generation
    //---------------------------------------

    const result = await ExamGeneratorAgent.generate(data);

    //---------------------------------------
    // Save Questions
    //---------------------------------------

    const questionIds = [];

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

            exam: exam.title,

            tags: q.tags || [],

            generatedByAI: true,

            reviewed: q.approved || false,

            createdBy: teacherId,

        });

        questionIds.push(question._id);

        savedQuestions.push(question);

    }

    //---------------------------------------
    // Attach Questions To Exam
    //---------------------------------------

    exam.questions.push(...questionIds);

    exam.totalMarks = exam.questions.length;

    await exam.save();

    //---------------------------------------
    // Return
    //---------------------------------------

    return {

        exam,

        questions: savedQuestions,

        stats: result.stats,

    };

};
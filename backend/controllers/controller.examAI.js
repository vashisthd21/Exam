import ExamGeneratorAgent from "../ai/agents/ExamGeneratorAgent.js";
import Question from "../models/model.quiz.js";

// -------------------------------------------
// Generate AI Questions
// -------------------------------------------

export const generateQuestions = async (req, res) => {
  try {
    const {
      subject,
      topic,
      difficulty,
      type,
      count,
    } = req.body;

    const result = await ExamGeneratorAgent.generate({
      subject,
      topic,
      difficulty,
      type,
      count,
    });

    res.status(200).json({
      success: true,
      ...result,
    });

  } catch (error) {
    console.error("Generate Questions Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// -------------------------------------------
// Save AI Generated Questions
// -------------------------------------------

export const saveGeneratedQuestions = async (req, res) => {
  try {
    const {
      questions,
      subject,
      topic,
      year,
      exam,
    } = req.body;

    const savedQuestions = [];

    for (const q of questions) {

      const answerIndex = q.options.findIndex(
        (option) => option === q.answer
      );

      const question = await Question.create({

        subject,

        topic,

        question: q.question,

        options: q.options,

        answer: answerIndex,

        explanation: q.explanation,

        difficulty: q.difficulty || "Moderate",

        year: year || new Date().getFullYear(),

        exam: exam || "AI Generated",

        generatedByAI: true,

        tags: [],

        conceptSummary: ""

      });

      savedQuestions.push(question);

    }

    res.status(201).json({
      success: true,
      message: "Questions saved successfully.",
      count: savedQuestions.length,
      questions: savedQuestions,
    });

  } catch (error) {

    console.error("Save Questions Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
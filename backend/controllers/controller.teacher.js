import Exam from "../models/model.exam.js";
import User from "../models/model.user.js";
import Question from "../models/model.question.js";
import ExamGeneratorAgent from "../ai/agents/ExamGeneratorAgent.js";
// ======================================================
// Dashboard Statistics
// GET /api/teacher/dashboard
// ======================================================

export const teacherDashboard = async (req, res) => {
    try {
        const teacherId = req.user._id;
        const totalExams = await Exam.countDocuments({
            teacher: teacherId
        });
        const publishedExams = await Exam.countDocuments({
            teacher: teacherId,
            isPublished: true
        });
        const unpublishedExams = await Exam.countDocuments({
            teacher: teacherId,
            isPublished: false
        });
        const totalStudents = await User.countDocuments({
            role: "student"
        });
        const recentExams = await Exam.find({
            teacher: teacherId
        })
            .sort({ createdAt: -1 })
            .limit(5);

        return res.status(200).json({
            success: true,
            dashboard: {
                totalExams,
                publishedExams,
                unpublishedExams,
                totalStudents,
                recentExams
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Unable to load dashboard."
        });
    }
};
// ======================================================
// Create Exam
// POST /api/teacher/exam
// ======================================================

export const createExam = async (req, res) => {

    try {
        const {

            title,

            subject,

            topic,

            duration,

            difficulty,

            totalMarks,

            passingMarks,

            startTime,

            endTime

        } = req.body;


        if (!title || !subject || !topic) {

            return res.status(400).json({

                success: false,

                message: "Please fill all required fields."

            });

        }


        const exam = await Exam.create({

            title,

            subject,

            topic,

            duration,

            difficulty,

            totalMarks,

            passingMarks,

            startTime,

            endTime,

            teacher: req.user._id

        });


        return res.status(201).json({

            success: true,

            message: "Exam created successfully.",

            exam

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Unable to create exam."

        });

    }

};


// ======================================================
// Get All Exams
// GET /api/teacher/exams
// ======================================================

export const getAllExams = async (req, res) => {

    try {

        const exams = await Exam.find({

            teacher: req.user._id

        })

            .sort({

                createdAt: -1

            });

        return res.status(200).json({

            success: true,

            exams

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Unable to fetch exams."

        });

    }

};


// ======================================================
// Get Single Exam
// GET /api/teacher/exam/:id
// ======================================================

export const getExamById = async (req, res) => {

    try {

        const exam = await Exam.findOne({
            _id: req.params.id,
            teacher: req.user._id
        }).populate("questions");

        if (!exam) {

            return res.status(404).json({

                success: false,

                message: "Exam not found."

            });

        }

        return res.status(200).json({

            success: true,

            exam

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Unable to fetch exam."

        });

    }

};


// ======================================================
// Delete Exam
// DELETE /api/teacher/exam/:id
// ======================================================

export const deleteExam = async (req, res) => {

    try {

        const exam = await Exam.findOne({

            _id: req.params.id,

            teacher: req.user._id

        });

        if (!exam) {

            return res.status(404).json({

                success: false,

                message: "Exam not found."

            });

        }

        await exam.deleteOne();

        return res.status(200).json({

            success: true,

            message: "Exam deleted successfully."

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Unable to delete exam."

        });

    }

};


// ======================================================
// Publish Exam
// PATCH /api/teacher/exam/publish/:id
// ======================================================

export const publishExam = async (req, res) => {

    try {

        const exam = await Exam.findOne({

            _id: req.params.id,

            teacher: req.user._id

        });

        if (!exam) {

            return res.status(404).json({

                success: false,

                message: "Exam not found."

            });

        }

        exam.isPublished = true;

        await exam.save();

        return res.status(200).json({

            success: true,

            message: "Exam published successfully."

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Unable to publish exam."

        });

    }

};


// ======================================================
// Unpublish Exam
// PATCH /api/teacher/exam/unpublish/:id
// ======================================================

export const unpublishExam = async (req, res) => {

    try {

        const exam = await Exam.findOne({

            _id: req.params.id,

            teacher: req.user._id

        });

        if (!exam) {

            return res.status(404).json({

                success: false,

                message: "Exam not found."

            });

        }

        exam.isPublished = false;

        await exam.save();

        return res.status(200).json({

            success: true,

            message: "Exam unpublished successfully."

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Unable to unpublish exam."

        });

    }

};
// ======================================================
// Generate AI Questions For Exam
// POST /api/teacher/exam/:examId/generate
// ======================================================

export const generateQuestionsForExam = async (req, res) => {

    try {

        const exam = await Exam.findOne({

            _id: req.params.examId,

            teacher: req.user._id

        });

        if (!exam) {

            return res.status(404).json({

                success: false,

                message: "Exam not found."

            });

        }

        //---------------------------------------------
        // Generate + Verify + Quality Check
        //---------------------------------------------

        const result = await ExamGeneratorAgent.generate(req.body);

        const savedQuestions = [];

        //---------------------------------------------
        // Save Questions
        //---------------------------------------------

        for (const q of result.questions) {
            const answerIndex = q.options.findIndex(
                option =>
                    option.trim().toLowerCase() ===
                    q.answer.trim().toLowerCase()
            );
        
            if (answerIndex === -1) {
                throw new Error(
                    `Correct answer "${q.answer}" not found in options.`
                );
            }

            const question = await Question.create({

                question: q.question,

                options: q.options,

                answer: answerIndex,

                explanation: q.explanation,

                subject: req.body.subject,

                topic: req.body.topic,

                subTopic: q.subTopic || "",

                conceptSummary: q.conceptSummary || "",

                difficulty: req.body.difficulty,

                year: req.body.year || new Date().getFullYear(),

                exam: exam.title,

                tags: q.tags || [],

                generatedByAI: true,

                reviewed: q.approved || false,

                createdBy: req.user._id

            });

            savedQuestions.push(question);

            exam.questions.push(question._id);

        }

        //---------------------------------------------
        // Update Total Marks
        //---------------------------------------------

        exam.totalMarks = exam.questions.length;

        await exam.save();

        //---------------------------------------------
        // Response
        //---------------------------------------------

        return res.status(201).json({

            success: true,

            message: `${savedQuestions.length} AI questions generated successfully.`,

            stats: result.stats,

            exam,

            questions: savedQuestions

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
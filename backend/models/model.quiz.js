import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
    },

    topic: {
      type: String,
      trim: true,
    },

    duration: {
      type: Number,
      default: 30,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    totalMarks: {
      type: Number,
      default: 0,
    },

    passingMarks: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isPublished: {
      type: Boolean,
      default: false,
    },

    startTime: Date,

    endTime: Date,
  },
  {
    timestamps: true,
  }
);

const Quiz =
  mongoose.models.Quiz ||
  mongoose.model("Quiz", quizSchema);

export default Quiz;
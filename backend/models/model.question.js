import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length === 4,
        message: "Exactly 4 options are required.",
      },
    },

    answer: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },

    explanation: {
      type: String,
      default: "",
    },

    subject: {
      type: String,
      required: true,
    },

    topic: {
      type: String,
      trim: true,
    },

    subTopic: {
      type: String,
      trim: true,
    },

    conceptSummary: {
      type: String,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    bloomLevel: {
      type: String,
      enum: [
        "Remember",
        "Understand",
        "Apply",
        "Analyze",
        "Evaluate",
        "Create",
      ],
      default: "Understand",
    },

    year: {
      type: Number,
    },

    exam: {
      type: String,
      default: "Custom",
    },

    tags: {
      type: [String],
      default: [],
    },

    generatedByAI: {
      type: Boolean,
      default: false,
    },

    reviewed: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Question =
  mongoose.models.Question ||
  mongoose.model("Question", questionSchema);

export default Question;
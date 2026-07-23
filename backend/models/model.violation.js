import mongoose from "mongoose";

const violationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    quizType: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    message: String,

    riskScore: {
      type: Number,
      default: 0,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },

    autoSubmitted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Violation",
  violationSchema
);
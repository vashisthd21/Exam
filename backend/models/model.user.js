import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: false,
    },

    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },

    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },

    otp: String,
    otpExpire: Date,

    resetPasswordToken: String,
    resetPasswordExpire: Date,

    totalScore: {
      type: Number,
      default: 0,
    },

    quizSubmitted: {
      type: Boolean,
      default: false,
    },

    quizScore: {
      type: Number,
      default: 0,
    },
    otpRequestCount: {
      type: Number,
      default: 0
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
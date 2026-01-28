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

    // ❗ Password NOT required for Google users
    password: {
      type: String,
      required: false,
    },

    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },

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
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);

import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
      enum: [
        'Polity',
        'Economy',
        'History',
        'Geography',
        'Environment',
        'Science & Tech',
        'Current Affairs',
      ],
    },
    explanation: {
      type: String,
      required: true
    },

    tags: [
      {
        type: String
      }
    ],
    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    // index of correct option (0,1,2,3)
    answer: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },

    // UPSC PYQ year
    year: {
      type: Number,
      required: true,
    },

    // exam source (future ready)
    exam: {
      type: String,
      default: 'UPSC Prelims',
    },

    // optional but useful
    difficulty: {
      type: String,
      enum: ['Easy', 'Moderate', 'Hard'],
      default: 'Moderate',
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const Question = mongoose.model('Question', questionSchema);
export default Question;

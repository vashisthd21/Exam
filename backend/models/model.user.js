import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    totalScore: { type: Number, default: 0 },

    quizSubmitted: {type: Boolean, default: false},
    quizScore: {type: Number, default: 0},
});

const User = mongoose.model('User', userSchema);
export default User;

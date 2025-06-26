import express from 'express';
const router = express.Router();

import {getQuestions, submitQuiz} from '../controllers/controller.quiz.js';
// const {getQuestions} = require('../controller/controller.quiz.js');
import authMiddleware from '../middleware/authmiddleware.js';

router.get('/start', authMiddleware, getQuestions);
// router.get('/start', getQuestions);
// console.log(req.body);
<<<<<<< HEAD
router.post('/submit', submitQuiz);
=======
router.post('./submit', submitQuiz);
>>>>>>> upstream/main

export default router;
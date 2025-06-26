import express from 'express';
const router = express.Router();

import {getQuestions, submitQuiz} from '../controllers/controller.quiz.js';
// const {getQuestions} = require('../controller/controller.quiz.js');
import authMiddleware from '../middleware/authmiddleware.js';

router.get('/start', authMiddleware, getQuestions);
// router.get('/start', getQuestions);
// console.log(req.body);

router.post('/submit', submitQuiz);

router.post('./submit', submitQuiz);


export default router;

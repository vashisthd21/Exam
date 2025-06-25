import express from 'express';
const router = express.Router();

import getQuestions from '../controllers/controller.quiz.js';
// const {getQuestions} = require('../controller/controller.quiz.js');
import authMiddleware from '../middleware/authmiddleware.js';

router.get('/start', authMiddleware, getQuestions);
// router.get('/start', getQuestions);


export default router;
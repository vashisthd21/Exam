import express from "express";

import {
  generateQuestions,
  saveGeneratedQuestions
} from "../controllers/controller.examAI.js";

const router = express.Router();

router.post("/generate", generateQuestions);

router.post("/save", saveGeneratedQuestions);

export default router;
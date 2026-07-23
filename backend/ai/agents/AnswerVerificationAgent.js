import { generateText } from "../services/huggingFaceService.js";

class AnswerVerificationAgent {
  async verifyAll(questions) {
    const prompt = `
You are an expert university professor.

Your task is to verify the following AI-generated MCQs.

For EACH question:

1. Check if the answer is correct.
2. Check if ONLY one option is correct.
3. Check if the explanation is correct.
4. Check if the question is unambiguous.
5. Correct the answer if necessary.
6. Improve the explanation if necessary.
7. Give a confidence score (0 to 1).

Return ONLY valid JSON.

Questions:

${JSON.stringify(questions, null, 2)}

Return format:

[
  {
    "verified": true,
    "confidence": 0.97,
    "correctAnswer": "",
    "correctOptionIndex": 0,
    "explanation": "",
    "issues": []
  }
]
`;

    const response = await generateText(prompt);

    try {
      let clean = response.trim();

      clean = clean.replace(/```json/g, "");
      clean = clean.replace(/```/g, "");

      return JSON.parse(clean);

    } catch (error) {

      console.error(response);

      throw new Error("Verification Agent returned invalid JSON.");

    }
  }
}

export default new AnswerVerificationAgent();
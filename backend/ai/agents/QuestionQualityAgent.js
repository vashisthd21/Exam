import { generateText } from "../services/huggingFaceService.js";

class QuestionQualityAgent {

    async checkAll(questions) {

        const prompt = `
You are an expert university professor and exam quality reviewer.

Your job is to evaluate the QUALITY of every question.

Check:

1. Is the question grammatically correct?
2. Is the question clear?
3. Does it contain exactly one correct answer?
4. Are the distractors meaningful?
5. Are there duplicate options?
6. Does the explanation match the answer?
7. Does the difficulty match?
8. Is the question suitable for an exam?

Return ONLY JSON.

Questions:

${JSON.stringify(questions, null, 2)}

Return format:

[
  {
    "approved": true,
    "qualityScore": 9.4,
    "issues": [],
    "suggestions": []
  }
]
`;

        const response = await generateText(prompt);

        try {

            let clean = response.trim();

            clean = clean.replace(/```json/g, "");
            clean = clean.replace(/```/g, "");

            return JSON.parse(clean);

        }
        catch (err) {

            console.log(response);

            throw new Error("Quality Agent returned invalid JSON.");

        }

    }

}

export default new QuestionQualityAgent();
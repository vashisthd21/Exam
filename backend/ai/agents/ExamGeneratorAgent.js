import examPrompt from "../prompts/examPrompt.js";
import { generateText } from "../services/huggingFaceService.js";
import AnswerVerificationAgent from "./AnswerVerificationAgent.js";
import QuestionQualityAgent from "./QuestionQualityAgent.js";

class ExamGeneratorAgent {

  async generate(data) {

    try {

      //------------------------------------
      // STEP 1 : Generate Questions
      //------------------------------------

      const prompt = examPrompt(data);

      const response = await generateText(prompt);

      let generatedQuestions;

      try {

        let clean = response.trim();

        clean = clean.replace(/```json/g, "");
        clean = clean.replace(/```/g, "");

        generatedQuestions = JSON.parse(clean);

      } catch (err) {

        console.error("Generator Response:");
        console.log(response);

        throw new Error("Generator Agent returned invalid JSON.");

      }

      console.log("Generated Questions:", generatedQuestions.length);

      //------------------------------------
      // STEP 2 : Verify Answers
      //------------------------------------

      const verification =
        await AnswerVerificationAgent.verifyAll(generatedQuestions);

      const verifiedQuestions =
        generatedQuestions.map((question, index) => ({

          ...question,

          answer:
            verification[index]?.correctAnswer ??
            question.answer,

          explanation:
            verification[index]?.explanation ??
            question.explanation,

          verified:
            verification[index]?.verified ?? false,

          confidence:
            verification[index]?.confidence ?? 0,

          issues:
            verification[index]?.issues ?? []

        }));

      console.log("Verification Completed");

      //------------------------------------
      // STEP 3 : Quality Check
      //------------------------------------

      const quality =
        await QuestionQualityAgent.checkAll(verifiedQuestions);

      const finalQuestions =
        verifiedQuestions.map((question, index) => ({

          ...question,

          approved:
            quality[index]?.approved ?? false,

          qualityScore:
            quality[index]?.qualityScore ?? 0,

          qualityIssues:
            quality[index]?.issues ?? [],

          suggestions:
            quality[index]?.suggestions ?? []

        }));

      console.log("Quality Check Completed");

      //------------------------------------
      // STEP 4 : Statistics
      //------------------------------------

      const stats = {

        totalQuestions: finalQuestions.length,

        verifiedQuestions:
          finalQuestions.filter(q => q.verified).length,

        approvedQuestions:
          finalQuestions.filter(q => q.approved).length,

        averageConfidence:

          (
            finalQuestions.reduce(
              (sum, q) => sum + q.confidence,
              0
            ) / finalQuestions.length
          ).toFixed(2),

        averageQuality:

          (
            finalQuestions.reduce(
              (sum, q) => sum + q.qualityScore,
              0
            ) / finalQuestions.length
          ).toFixed(2)

      };

      console.log("Exam Generation Completed");

      return {

        questions: finalQuestions,

        stats

      };

    }

    catch (error) {

      console.error("ExamGeneratorAgent Error:", error);

      throw error;

    }

  }

}

export default new ExamGeneratorAgent();
import QuizAttempt from "../../models/model.quizAttempt.js";

class PerformanceService {

    static async getUserPerformance(userId) {

        const attempts = await QuizAttempt.find({ userId })
            .populate({
                path: "responses.questionId",
                select: "subject topic difficulty answer"
            });

        if (attempts.length === 0) {

            return {

                totalQuizzes: 0,

                totalQuestions: 0,

                overallAccuracy: 0,

                subjectWisePerformance: [],

                weakSubjects: [],

                strongSubjects: []

            };

        }

        const subjectMap = {};

        let totalQuestions = 0;

        let totalCorrect = 0;

        for (const attempt of attempts) {

            totalQuestions += attempt.responses.length;

            totalCorrect += attempt.score;

            for (const response of attempt.responses) {

                const q = response.questionId;

                if (!q) continue;

                const subject = q.subject;

                if (!subjectMap[subject]) {

                    subjectMap[subject] = {

                        subject,

                        attempts: 0,

                        correct: 0,

                        easy: 0,

                        moderate: 0,

                        hard: 0

                    };

                }

                subjectMap[subject].attempts++;

                if (response.selectedOption === q.answer) {

                    subjectMap[subject].correct++;

                }

                if (q.difficulty === "Easy")

                    subjectMap[subject].easy++;

                if (q.difficulty === "Moderate")

                    subjectMap[subject].moderate++;

                if (q.difficulty === "Hard")

                    subjectMap[subject].hard++;

            }

        }

        const subjectWisePerformance = Object.values(subjectMap).map(item => {

            return {

                ...item,

                accuracy: Number(

                    ((item.correct / item.attempts) * 100).toFixed(1)

                )

            };

        });

        const weakSubjects = subjectWisePerformance

            .filter(s => s.accuracy < 60)

            .sort((a, b) => a.accuracy - b.accuracy);

        const strongSubjects = subjectWisePerformance

            .filter(s => s.accuracy >= 80)

            .sort((a, b) => b.accuracy - a.accuracy);

        return {

            totalQuizzes: attempts.length,

            totalQuestions,

            overallAccuracy: Number(

                ((totalCorrect / totalQuestions) * 100).toFixed(1)

            ),

            subjectWisePerformance,

            weakSubjects,

            strongSubjects

        };

    }

}

export default PerformanceService;
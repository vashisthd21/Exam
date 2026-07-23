const examPrompt = ({
  subject,
  topic,
  difficulty,
  numberOfQuestions,
}) => {

return `
You are an experienced university professor.

Generate EXACTLY ${numberOfQuestions} multiple choice questions.

Subject: ${subject}

Topic: ${topic}

Difficulty: ${difficulty}

IMPORTANT RULES:

1. Return ONLY valid JSON.
2. Return an ARRAY.
3. The array MUST contain EXACTLY ${numberOfQuestions} questions.
4. Do NOT return markdown.
5. Do NOT write any text before or after JSON.
6. Every question must be unique.
7. Each question must have exactly 4 options.
8. The answer must exactly match one of the options.

Example format:

[
{
  "question":"",

  "options":[
    "",
    "",
    "",
    ""
  ],

  "answer":"",

  "difficulty":"${difficulty}",

  "explanation":""
}
]

Return ONLY the JSON array.
`;
};

export default examPrompt;
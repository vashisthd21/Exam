import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { GoogleGenAI } from "@google/genai";

import Question from "../models/model.quiz.js"; // <-- change path if needed

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function connectDB() {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateMetadata(question) {

    const prompt = `
You are an UPSC expert.

Analyze the following UPSC question.

Return ONLY valid JSON.

Schema:

{
    "topic":"",
    "subTopic":"",
    "tags":["","",""],
    "conceptSummary":""
}

Rules:

- Topic should be chapter level.
- SubTopic should be very specific.
- Generate 3-6 tags.
- conceptSummary must be less than 40 words.
- No markdown.
- No explanation.

Question:
${question.question}

Options:
${question.options.join("\n")}

Correct Answer:
${question.options[question.answer]}

Subject:
${question.subject}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
    });

    let text = response.text;

    // remove ```json
    text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    return JSON.parse(text);
}

async function main() {

    await connectDB();

    const questions = await Question.find();

    console.log(`Found ${questions.length} questions\n`);

    let processed = 0;

    for (const question of questions) {

        try {

            // Skip already processed questions
            if (
                question.topic &&
                question.tags &&
                question.tags.length > 0
            ) {
                console.log(`Skipped ${question._id}`);
                continue;
            }

            console.log(`Processing ${question._id}`);

            const metadata = await generateMetadata(question);

            question.topic = metadata.topic;

            question.subTopic = metadata.subTopic;

            question.tags = metadata.tags;

            question.conceptSummary =
                metadata.conceptSummary;

            await question.save();

            processed++;

            console.log(`✓ Updated`);

        } catch (err) {

            console.log(`Failed ${question._id}`);

            console.log(err.message);

        }

        // avoid hitting rate limits
        await delay(1500);
    }

    console.log(`\nDone`);

    console.log(`Updated ${processed} questions`);

    process.exit();

}

main();
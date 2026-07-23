// backend/scripts/testGemini.js

import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function test(model) {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: "Say hello."
        });

        console.log(`✅ ${model} works`);
        console.log(response.text);
    } catch (err) {
        console.log(`❌ ${model} failed`);
        console.log(err.message);
    }
}

await test("gemini-flash-latest");
await test("gemini-3.5-flash");
await test("gemini-3.1-flash-lite");
await test("gemini-2.0-flash");
import { GoogleGenAI } from "@google/genai";

import revisionPrompt from "../prompts/revisionPrompt.js";

import PerformanceTool from "../tools/PerformanceTool.js";

const ai = new GoogleGenAI({
    apiKey:process.env.GEMINI_API_KEY
});

class RevisionAgent{

    static async run(userId){

        const performance =
            await PerformanceTool.execute(userId);

        const prompt = `

${revisionPrompt}

Student Performance

${JSON.stringify(performance)}

`;

        const response = await ai.models.generateContent({

            model:"gemini-2.5-flash",

            contents:prompt

        });

        return response.text;

    }

}

export default RevisionAgent;
const apiKey = process.env.GEMINI_API_KEY;

/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

/*const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");*/

import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

// const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
];

async function run(prompt) {
    const chatSession = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    console.log(result.response.text());
    return result.response.text();
}

export async function extractFlightParams(prompt) {
    const extractionPrompt = `
    Analyze the following user query to see if it is a flight search request.
    If it IS a flight search, extract the following parameters in JSON format:
    - origin (IATA code if possible, or city name)
    - destination (IATA code if possible, or city name)
    - departureDate (YYYY-MM-DD format. If "Christmas" or "next Friday", calculate the date for 2025 unless specified. Today is ${new Date().toISOString().split('T')[0]})
    - returnDate (YYYY-MM-DD format, optional)
    - adults (number, default 1)
    
    If it is NOT a flight search, return "null" (string).
    
    User Query: "${prompt}"
    
    Output strictly JSON or "null". Do not add markdown formatting.
    `;

    const result = await model.generateContent(extractionPrompt);
    const text = result.response.text().trim();
    
    try {
        // Clean up markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        if (jsonStr === "null") return null;
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse flight params", e);
        return null;
    }
}

export default run;

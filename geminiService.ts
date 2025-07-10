import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { getSystemInstruction, RESPONSE_SCHEMA } from '../constants';
import type { RawStoryPart, CharacterProfile } from '../types';
import { Language, Genre } from "../types";

let ai: GoogleGenAI;

function getAiClient(): GoogleGenAI {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
}

export function startNewGame(language: Language, genre: Genre, character: CharacterProfile): Chat {
    const client = getAiClient();
    return client.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: getSystemInstruction(language, genre, character),
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA,
        },
    });
}

export async function advanceStory(chat: Chat, playerInput: string): Promise<RawStoryPart> {
    const response: GenerateContentResponse = await chat.sendMessage({ message: playerInput });
    
    try {
        const text = response.text.trim();
        // Fallback for empty or incomplete JSON
        if (!text || text.length < 10) {
             throw new Error("Received an empty or invalid response from the Chronicler.");
        }
        const storyData: RawStoryPart = JSON.parse(text);
        return storyData;
    } catch (e) {
        console.error("Failed to parse JSON response from Gemini:", response.text);
        console.error(e);
        throw new Error("The story took an unexpected turn. The Chronicler seems to have lost his train of thought. Please try again.");
    }
}

const imagePromptPrefixes: Record<Genre, string> = {
    [Genre.FANTASY]: "cinematic fantasy art, hyperrealistic, epic lighting, dark fantasy, detailed, atmospheric.",
    [Genre.ISEKAI]: "vibrant anime art style, fantasy world, detailed background, dynamic lighting, high quality.",
    [Genre.SCI_FI]: "cinematic sci-fi art, futuristic, detailed machinery, cosmic lighting, hyperrealistic, epic.",
    [Genre.CYBERPUNK]: "cinematic cyberpunk art, neon-drenched, dystopian, gritty, high-tech, Blade Runner style.",
};

export async function generateSceneImage(description: string, genre: Genre): Promise<string> {
    const client = getAiClient();
    const prefix = imagePromptPrefixes[genre] || imagePromptPrefixes[Genre.FANTASY];
    const prompt = `${prefix} ${description}`;

    const response = await client.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '16:9',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    
    throw new Error("The mists obscure your vision... (Failed to generate image)");
}

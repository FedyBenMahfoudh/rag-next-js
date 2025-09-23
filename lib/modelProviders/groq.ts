import Groq from "groq-sdk";
import { messageHistory } from "@/types";

export enum GroqRoles {
    SYSTEM = "system",
    ASSISTANT = "assistant",
    USER = "user",
}

const apiKey = process.env.GROQ_API_KEY;
const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

if (!apiKey) throw new Error("🚨 GROQ_API_KEY is not configured");

const instance = new Groq({ apiKey });

export const GroqCloud = {
    api_key: apiKey,
    model,
    instance,
    structureMsg: (prompt: string, role: GroqRoles): messageHistory => ({
        role,
        content: prompt,
    }),
};

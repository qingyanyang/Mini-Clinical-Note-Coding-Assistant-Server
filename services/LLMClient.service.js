import OpenAI from "openai";
import { ASSISTANT_ROLE, MODEL, API_KEY, USER_ROLE } from "../config/openAI.js";
import { zodTextFormat } from "openai/helpers/zod.mjs";
import { SYSTEM_PROMPT, buildUserPrompt, FORMAT_SYSTEM_PROMPT } from '../prompts/analysis.prompt.js';
import { TranscriptFormatSchema } from "../schemas/analysis.validation.js";

const openAIClient = new OpenAI({ apiKey: API_KEY });

// @ts-ignore
export const runAnalysisLLM = async (transcript, zodObject) => {
    // @ts-ignore
    const response = await openAIClient.responses.parse({
        model: MODEL,
        input: [
            // @ts-ignore
            { role: ASSISTANT_ROLE, content: SYSTEM_PROMPT },
            // @ts-ignore
            {
                role: USER_ROLE,
                content: buildUserPrompt(transcript),
            },
        ],
        text: {
            format: zodTextFormat(zodObject, "result")
        }
    });

    if (response.status !== "completed" || !response.output_parsed) {
        throw new Error("Model did not complete a valid structured response");
    }

    return {
        parsed: response.output_parsed
    };
}

export const runFormatRequestLLM = async (rawTranscript) => {
    // @ts-ignore
    const response = await openAIClient.responses.parse({
        model: MODEL,
        input: [
            // @ts-ignore
            { role: ASSISTANT_ROLE, content: FORMAT_SYSTEM_PROMPT },
            // @ts-ignore
            {
                role: USER_ROLE,
                content: buildUserPrompt(rawTranscript),
            },
        ],
        text: { format: zodTextFormat(TranscriptFormatSchema, "transcript_format") },
    });

    if (response.status !== "completed" || !response.output_parsed) {
        throw new Error("Model did not complete a valid structured response");
    }

    return {
        parsed: response.output_parsed
    };
}


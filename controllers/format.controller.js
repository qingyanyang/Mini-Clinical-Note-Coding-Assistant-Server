
import { FormatRawRequestSchema } from '../schemas/analysis.validation.js';
import { runFormatRequestLLM } from '../services/LLMClient.service.js';

export const createFormatTranscript = async (req, res, next) => {
    try {
        const parsedRequest = FormatRawRequestSchema.parse(req.body ?? {});
        const { rawTranscriptText } = parsedRequest;

        const parsedResponse = await runFormatRequestLLM(rawTranscriptText);
        res.formatResponse({ parsedResponse }, 201);
    } catch (e) {
        console.error(e);
        next(e);
    }
}

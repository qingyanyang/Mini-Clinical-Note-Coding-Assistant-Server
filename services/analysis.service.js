import { AnalysisSchema } from "../schemas/analysis.validation.js";
import { buildBanner, scanRisk, softenClaims } from "./guardrails.service.js";
import { runAnalysisLLM } from "./LLMClient.service.js";


export const generateAnalysis = async ({ transcriptText, ack = false }) => {

    // scan risk of request
    const risk = scanRisk(transcriptText);

    // early return if transcript contains emergencies
    if (risk.level === 'high' && !ack) {
        const response = {
            banner: buildBanner(risk),
            guardrails: {
                requiresAcknowledgement: true,
                reasons: (risk.reasons?.length ? risk.reasons : [])
            },
        };
        return response;
    }
    // ai analysis
    let analysisRes;
    try {
        analysisRes = await runAnalysisLLM(transcriptText, AnalysisSchema);
    } catch (err) {
        //retry
        try {
            analysisRes = await runAnalysisLLM(transcriptText, AnalysisSchema);
        } catch (err2) {
            const err = new Error('Model could not produce a valid structured response, please try again later.');
            // @ts-ignore
            err.status = 422;
            throw err;
        }
    }

    // soften claims before return to client
    const modelData = softenClaims(analysisRes.parsed);

    // build response
    const bannerRisk = risk.level === 'high' ? 'high' : modelData.risks?.riskLevel ?? 'none';
    const fullResponse = {
        schemaVersion: 1,
        banner: buildBanner(bannerRisk),
        guardrails: {
            requiresAcknowledgement: false,
            reasons: bannerRisk === 'high' ? (risk.reasons?.length ? risk.reasons : modelData.risks?.reasons ?? []) : []
        },
        data: modelData,
        claimsSoftened: true,
        createdAt: new Date().toISOString()
    };

    return fullResponse;
}
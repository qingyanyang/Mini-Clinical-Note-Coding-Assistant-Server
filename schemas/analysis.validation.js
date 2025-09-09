import { z } from "zod";

export const FormatRawRequestSchema = z.object({
    rawTranscriptText: z.string().min(1, 'Transcript is required').max(10000),
});

export const AnalyzeRequestSchema = z.object({
    transcriptText: z.string().min(1, 'Transcript is required').max(10000),
    ack: z.boolean().optional()
});

export const TranscriptTurn = z.object({
    speaker: z.enum(["clinician", "patient", "unknown"]),
    text: z.string(),
});

export const TranscriptFormatSchema = z.object({
    formatted: z.string(),
    turns: z.array(TranscriptTurn).max(50),
});

export const Confidence = z.enum(["low", "med", "high"]);

export const SOAP = z.object({
    subjective: z.string(),
    objective: z.string(),
    assessment: z.string(),
    plan: z.string(),
});

export const ICD = z.object({
    code: z.string(),
    description: z.string(),
    confidence: Confidence,
});

export const Problem = z.object({
    name: z.string(),
    rationale: z.string(),
    icd10: ICD
});

export const CPT = z.object({
    code: z.string(),
    justification: z.string(),
    confidence: Confidence,
});

export const AnalysisSchema = z.object({
    schemaVersion: z.literal(1),
    documentation: SOAP,
    problems: z.array(Problem).max(6),
    icd10: z.array(ICD).max(3),
    billing: z.object({
        emLevel: z.union([
            z.literal("99212"),
            z.literal("99213"),
            z.literal("99214"),
            z.literal("99215"),
            z.null()
        ]),
        cpt: z.array(CPT).max(3).default([]),
        hintSummary: z.string(),
    }),
    risks: z.object({
        riskLevel: z.enum(["none", "high"]),
        reasons: z.array(z.string()).max(5),
    }),
    complianceNote: z.string(),
});

export const ApiFullResponse = z.object({
    schemaVersion: z.literal(1),
    banner: z.object({
        text: z.string(),
    }),
    guardrails: z.object({
        requiresAcknowledgement: z.boolean(),
        reasons: z.array(z.string())
    }),
    data: AnalysisSchema,
    claimsSoftened: z.boolean(),
    createdAt: z.string(),
});
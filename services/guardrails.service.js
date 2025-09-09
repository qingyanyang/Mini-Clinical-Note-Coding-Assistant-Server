import { BASE_BANNER, EMERGENCY_KEYWORDS, SOFTEN_MAP } from '../constants/guardrails.js';

export const scanRisk = (text = '') => {
    const found = [];
    const lower = text.toLowerCase();
    for (const kw of EMERGENCY_KEYWORDS) {
        if (lower.includes(kw)) found.push(kw);
    }
    return { level: found.length ? 'high' : 'none', reasons: found };
}

const MASTER_RE = new RegExp(`\\b(${Object.keys(SOFTEN_MAP).join('|')})\\b`, 'gi');

const caseMatch = (replacement, original) => {
    if (!replacement) return replacement;
    if (original.toUpperCase() === original) return replacement.toUpperCase();
    if (original[0] === original[0].toUpperCase()) {
        return replacement[0].toUpperCase() + replacement.slice(1);
    }
    return replacement;
}

export const soften = (text) => {
    if (!text) return text;
    return text.replace(MASTER_RE, (match) => {
        const rep = SOFTEN_MAP[match.toLowerCase()];
        return caseMatch(rep, match);
    });
}

export function softenClaims(model) {
    if (!model) return model;
    const out = { ...model };

    if (out.documentation) {
        out.documentation = {
            ...out.documentation,
            subjective: soften(out.documentation.subjective),
            objective: soften(out.documentation.objective),
            assessment: soften(out.documentation.assessment),
            plan: soften(out.documentation.plan),
        };
    }

    if (Array.isArray(out.problems)) {
        out.problems = out.problems.map(p => ({ ...p, rationale: soften(p.rationale) }));
    }

    if (Array.isArray(out.billing?.cpt)) {
        out.billing = {
            ...out.billing,
            cpt: out.billing.cpt.map(c => ({ ...c, justification: soften(c.justification) })),
        };
    }

    if (typeof out.complianceNote === 'string') {
        out.complianceNote = soften(out.complianceNote);
    }

    return out;
}

export const buildBanner = (riskLevel) => {
    return { text: BASE_BANNER, riskLevel };
}
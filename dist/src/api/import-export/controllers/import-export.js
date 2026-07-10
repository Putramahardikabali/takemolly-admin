"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sync_1 = require("csv-parse/sync");
const sync_2 = require("csv-stringify/sync");
// ==================== SUPPLEMENTS ====================
const SUPPLEMENT_SYMBOLS = {
    "l-carnitine": "L-Ca",
    curcumin: "Cu",
    magnesium: "Mg",
    saffron: "Saf",
    melatonin: "Mel",
};
const SUPPLEMENT_COLORS = {
    "l-carnitine": "rgba(255, 212, 101, 1)",
    curcumin: "rgba(122, 175, 255, 0.8)",
    magnesium: "rgba(146, 250, 231, 0.8)",
    saffron: "rgba(255, 233, 234, 0.8)",
    melatonin: "rgba(255, 255, 255, 0.8)",
};
const SUPPLEMENT_BORDER_COLORS = {
    "l-carnitine": "rgba(234, 145, 248, 0.8)",
    curcumin: "rgba(145, 248, 229, 0.8)",
    magnesium: "rgba(252, 251, 99, 0.8)",
    saffron: "rgba(255, 153, 162, 0.8)",
    melatonin: "rgba(80, 227, 229, 0.8)",
};
const SUPPLEMENT_DESCRIPTION = {
    "l-carnitine": "L-carnitine supplementation appears to be effective in reducing muscle damage, soreness, and oxidative stress following exercise, thereby enhancing overall recovery.",
    curcumin: "Curcumin supplementation appears to offer several benefits for exercise recovery, including reduced muscle damage and soreness, anti-inflammatory and antioxidant effects, thereby improving performance recovery.",
    magnesium: "Magnesium supplementation aids exercise recovery by reducing muscle soreness, inflammation, and muscle damage. It also improves sleep quality and regulates cortisol levels, supporting tissue repair and energy.",
    saffron: "Saffron supplementation can improve exercise recovery by reducing muscle damage and soreness, and enhance sleep quality through increased melatonin production.",
    melatonin: "Melatonin improves sleep quality and quantity, which is critical for recovery. Better sleep leads to enhanced physical and cognitive performance the following day.",
};
const SUPPLEMENT_INTEGER_FIELDS = [
    "linear_score_cortisol",
    "linear_score_inflammation",
    "linear_score_muscle_damage",
    "linear_score_muscle_soreness",
    "linear_score_oxidative_stress",
    "linear_score_pain",
    "linear_score_sleep_quality",
    "max_cortisol",
    "max_inflammation",
    "max_muscle_damage",
    "max_muscle_soreness",
    "max_oxidative_stress",
    "max_pain",
    "max_sleep_quality",
    "sum_cortisol",
    "sum_cortisol_non_rollup",
    "sum_inflammation",
    "sum_inflammation_non_rollup",
    "sum_muscle_damage_participants",
    "sum_muscle_soreness",
    "sum_muscle_soreness_participants",
    "sum_muscle_soreness_non_rollup",
    "sum_oxidative_stress",
    "sum_oxidative_stress_non_rollup",
    "sum_pain",
    "sum_pain_non_rollup",
    "sum_participants_cortisol",
    "sum_participants_inflammation",
    "sum_participants_oxidative_stress",
    "sum_participants_pain",
    "sum_participants_sleep_quality",
    "sum_sleep_quality",
    "sum_sleep_quality_non_rollup",
    "sum_studies_cortisol",
    "sum_studies_inflammation",
    "sum_studies_muscle_damage",
    "sum_studies_muscle_soreness",
    "sum_studies_oxidative_stress",
    "sum_studies_pain",
    "sum_studies_sleep_quality",
];
const SUPPLEMENT_SCHEMA = {
    "Supplement Name": "supplement_name",
    "Dosage Cortisol": "dosage_cortisol",
    "Dosage Inflammation": "dosage_inflammation",
    "Dosage Muscle Damage": "dosage_muscle_damage",
    "Dosage Muscle Soreness": "dosage_muscle_soreness",
    "Dosage Oxidative Stress": "dosage_oxidative_stress",
    "Dosage Pain": "dosage_pain",
    "Dosage Sleep Quality": "dosage_sleep_quality",
    "Grade Score Cortisol": "grade_score_cortisol",
    "Grade Score Inflammation": "grade_score_inflammation",
    "Grade Score Muscle Damage": "grade_score_muscle_damage",
    "Grade Score Muscle Soreness": "grade_score_muscle_soreness",
    "Grade Score Oxidative Stress": "grade_score_oxidative_stress",
    "Grade Score Pain": "grade_score_pain",
    "Grade Score Sleep Quality": "grade_score_sleep_quality",
    "Inflammation Sum": "inflammation_sum",
    Label: "label",
    "Linear Score Cortisol": "linear_score_cortisol",
    "Linear Score Inflammation": "linear_score_inflammation",
    "Linear Score Muscle Damage": "linear_score_muscle_damage",
    "Linear Score Muscle Soreness": "linear_score_muscle_soreness",
    "Linear Score Oxidative Stress": "linear_score_oxidative_stress",
    "Linear Score Pain": "linear_score_pain",
    "Linear Score Sleep Quality": "linear_score_sleep_quality",
    "Max Cortisol": "max_cortisol",
    "Max Inflammation": "max_inflammation",
    "Muscle Damage Max": "max_muscle_damage",
    "Max Muscle Soreness": "max_muscle_soreness",
    "Max Oxidative Stress": "max_oxidative_stress",
    "Max Pain": "max_pain",
    "Max Sleep Quality": "max_sleep_quality",
    "Muscle Damage Sum": "muscle_damage_sum",
    "Muscle Damage Sum (non rollup)": "muscle_damage_sum_non_rollup",
    "Muscle Soreness Sum (non rollup)": "sum_muscle_soreness_non_rollup",
    "Sum Cortisol": "sum_cortisol",
    "Sum Cortisol (non rollup)": "sum_cortisol_non_rollup",
    "Sum Inflammation": "sum_inflammation",
    "Sum Inflammation (non rollup)": "sum_inflammation_non_rollup",
    "Sum Muscle Damage Participants": "sum_muscle_damage_participants",
    "Sum Muscle Soreness": "sum_muscle_soreness",
    "Sum Muscle Soreness Participants": "sum_muscle_soreness_participants",
    "Sum Oxidative Stress": "sum_oxidative_stress",
    "Sum Oxidative Stress (non rollup)": "sum_oxidative_stress_non_rollup",
    "Sum Pain": "sum_pain",
    "Sum Pain (non rollup)": "sum_pain_non_rollup",
    "Sum Participants Cortisol": "sum_participants_cortisol",
    "Sum Participants Inflammation": "sum_participants_inflammation",
    "Sum Participants Oxidative Stress": "sum_participants_oxidative_stress",
    "Sum Participants Pain": "sum_participants_pain",
    "Sum Participants Sleep Quality": "sum_participants_sleep_quality",
    "Sum Sleep Quality": "sum_sleep_quality",
    "Sum Sleep Quality (non rollup)": "sum_sleep_quality_non_rollup",
    "Sum Studies Cortisol": "sum_studies_cortisol",
    "Sum Studies Inflammation": "sum_studies_inflammation",
    "Sum Studies Muscle Damage": "sum_studies_muscle_damage",
    "Sum Studies Muscle Soreness": "sum_studies_muscle_soreness",
    "Sum Studies Oxidative Stress": "sum_studies_oxidative_stress",
    "Sum Studies Pain": "sum_studies_pain",
    "Sum Studies Sleep Quality": "sum_studies_sleep_quality",
    "TLDR: Cortisol": "tldr_cortisol",
    "TLDR: Inflammation": "tldr_inflammation",
    "TLDR: Muscle Damage": "tldr_muscle_damage",
    "TLDR: Muscle Soreness": "tldr_muscle_soreness",
    "TLDR: Oxidative Stress": "tldr_oxidative_stress",
    "TLDR: Pain": "tldr_pain",
    "TLDR: Sleep Quality": "tldr_sleep_quality",
    "📊 Stats": "stats",
};
// ==================== RESEARCH PAPERS ====================
const PAPER_INTEGER_FIELDS = [
    "NumberOfParticipants",
    "ParticipantsCortisol",
    "ParticipantsInflammation",
    "ParticipantsMuscleDamage",
    "ParticipantsMuscleSoreness",
    "ParticipantsOxidativeStress",
    "ParticipantsPain",
    "ParticipantsSleepQuality",
    "StudiesCortisol",
    "StudiesInflammation",
    "StudiesMuscleDamage",
    "StudiesMuscleSoreness",
    "StudiesOxidativeStress",
    "StudiesPain",
    "StudiesSleepQuality",
];
const PAPER_SCHEMA = {
    Paper: "URL",
    AMEND: "AMEND",
    Age: "Age",
    Area: "Area",
    "Body Type": "BodyType",
    "Cortisol Exercise Cleaning": "CortisolExerciseCleaning",
    "Created time": "CreatedTime",
    Effect: "Effect",
    "Files & media": "FilesAndMedia",
    "Fitness Cleaning": "FitnessCleaning",
    "Funding Notes": "FundingNotes",
    Label: "Label",
    "Last edited time": "LastEditedTime",
    "Meta Checked": "MetaChecked",
    NULL: "NULL",
    "Number of Participants": "NumberOfParticipants",
    "Participants Cortisol": "ParticipantsCortisol",
    "Participants Inflammation": "ParticipantsInflammation",
    "Participants Muscle Damage": "ParticipantsMuscleDamage",
    "Participants Muscle Soreness": "ParticipantsMuscleSoreness",
    "Participants Oxidative Stress": "ParticipantsOxidativeStress",
    "Participants Pain": "ParticipantsPain",
    "Participants Sleep Quality": "ParticipantsSleepQuality",
    Product: "Product",
    "Related to Results (1) (Research Papers )": "RelatedToResults1",
    "Related to Results (1) (Research Papers ) 1": "RelatedToResults2",
    Results: "Results",
    Sex: "Sex",
    Source: "Source",
    "Studies Cortisol": "StudiesCortisol",
    "Studies Inflammation": "StudiesInflammation",
    "Studies Muscle Damage": "StudiesMuscleDamage",
    "Studies Muscle Soreness": "StudiesMuscleSoreness",
    "Studies Oxidative Stress": "StudiesOxidativeStress",
    "Studies Pain": "StudiesPain",
    "Studies Sleep Quality": "StudiesSleepQuality",
    Supplement: "Supplement",
    TLDR: "TLDR",
    "Trial Design": "TrialDesign",
    "Trial Length": "TrialLength",
    URL: "URL",
    Year: "Year",
    Title: "Title",
};
// ==================== RESULTS ====================
const RESULT_INTEGER_FIELDS = [
    "benefitValue",
    "score",
    "participants",
    "age",
    "maxPain",
    "year",
];
const RESULT_SCHEMA = {
    Results: "title",
    Product: "product",
    "Main Tag": "mainTag",
    "Sub Tag": "subTag",
    Benefit: "benefit",
    "Benefit Value": "benefitValue",
    "Oxidative Stress Filter": "oxidativeStressFilter",
    "Muscle Damage Filter": "muscleDamageFilter",
    "Muscle Soreness Filter": "muscleSorenessFilter",
    "Inflammation Filter": "inflammationFilter",
    "Pain Filter": "painFilter",
    "Sleep Quality Filter": "sleepQualityFilter",
    "Cortisol Filter": "cortisolFilter",
    "Cortisol Cleaning": "cortisolCleaning",
    Score: "score",
    Participants: "participants",
    Age: "age",
    "Max Pain": "maxPain",
    Year: "year",
    Sex: "sex",
    "Body Type": "bodyType",
    Confidence: "confidence",
    "Trial Design": "trialDesign",
    "Trial Length": "trialLength",
};
// ==================== HELPERS ====================
function normalizeHeader(header) {
    return header
        .trim()
        .replace(/\uFEFF/g, "")
        .replace(/\u00A0/g, "")
        .replace(/\u200B/g, "");
}
function slugify(str) {
    if (!str)
        return "";
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}
function convertValue(raw, integerFields, strapiKey) {
    if (raw === "Yes")
        return true;
    if (raw === "No")
        return false;
    if (raw.trim() === "")
        return null;
    if (integerFields.includes(strapiKey)) {
        const parsed = parseInt(raw, 10);
        return isNaN(parsed) ? null : parsed;
    }
    return raw;
}
// ==================== SUPPLEMENTS LOGIC ====================
function mapSupplementRow(csvRow) {
    const strapiRow = {};
    for (const [csvRawKey, raw] of Object.entries(csvRow)) {
        const csvKey = normalizeHeader(csvRawKey);
        const strapiKey = SUPPLEMENT_SCHEMA[csvKey];
        if (!strapiKey)
            continue;
        strapiRow[strapiKey] = convertValue(raw, SUPPLEMENT_INTEGER_FIELDS, strapiKey);
    }
    strapiRow.slug = slugify(strapiRow.supplement_name);
    strapiRow.symbol = SUPPLEMENT_SYMBOLS[strapiRow.slug] || "";
    strapiRow.color = SUPPLEMENT_COLORS[strapiRow.slug] || "#FFD465";
    strapiRow.border_color =
        SUPPLEMENT_BORDER_COLORS[strapiRow.slug] || "rgba(234, 145, 248, 0.8)";
    strapiRow.is_our_supplement = SUPPLEMENT_SYMBOLS[strapiRow.slug]
        ? true
        : false;
    strapiRow.description = SUPPLEMENT_DESCRIPTION[strapiRow.slug] || "";
    return strapiRow;
}
// ==================== RESEARCH PAPERS LOGIC ====================
function mapResearchPaperRow(csvRow) {
    const strapiRow = {};
    for (const [csvRawKey, raw] of Object.entries(csvRow)) {
        const csvKey = normalizeHeader(csvRawKey);
        const strapiKey = PAPER_SCHEMA[csvKey];
        if (!strapiKey)
            continue;
        strapiRow[strapiKey] = convertValue(raw, PAPER_INTEGER_FIELDS, strapiKey);
    }
    const rawTitle = typeof strapiRow.Title === "string" ? strapiRow.Title : "";
    strapiRow.slug = slugify(rawTitle);
    return strapiRow;
}
// ==================== RESULT CONFIDENCE KEY ====================
const VALID_CONFIDENCE_KEYS = new Set([
    "check_evidence",
    "star_evidence",
    "cap_evidence",
    "caution",
]);
const CONFIDENCE_BREAKDOWN_LABELS = [
    "✅",
    "⭐",
    "🎓",
    "🚩",
    "🗒️",
    "empty",
    "other",
];
function createEmptyConfidenceBreakdown() {
    return Object.fromEntries(CONFIDENCE_BREAKDOWN_LABELS.map((label) => [
        label,
        { updated: 0, unchanged: 0, cleared: 0, unmatched: 0, duplicate: 0 },
    ]));
}
function classifyConfidenceLabel(raw) {
    const value = normalizeConfidenceCell(raw);
    if (!value)
        return "empty";
    const tokens = value
        .split(/[,;|/]+/)
        .map((token) => token.trim())
        .filter(Boolean);
    const searchSpace = (tokens.length > 0 ? tokens : [value]).join(" ");
    const hasMemo = confidenceContains(searchSpace, "🗒");
    const hasFlag = confidenceContains(searchSpace, "🚩");
    const hasCap = confidenceContains(searchSpace, "🎓");
    const hasStar = confidenceContainsAny(searchSpace, ["⭐", "★"]);
    const hasCheck = confidenceContainsAny(searchSpace, ["✅", "✔", "☑"]);
    if (hasFlag)
        return "🚩";
    if (hasCap)
        return "🎓";
    if (hasStar)
        return "⭐";
    if (hasCheck)
        return "✅";
    if (hasMemo)
        return "🗒️";
    return "other";
}
function formatCleanedResearchPapers(raw) {
    const titles = parseResearchPaperTitles(raw);
    if (titles.length > 0)
        return titles.join("; ");
    const single = stripNotionUrlSuffix(raw.trim());
    return single;
}
function mappingToNextKey(mapping) {
    if (mapping.action === "set")
        return mapping.key;
    if (mapping.action === "clear")
        return null;
    return undefined;
}
function parseImportAction(ctx) {
    var _a;
    const body = ctx.request.body;
    const query = ctx.query;
    const raw = (_a = body === null || body === void 0 ? void 0 : body.action) !== null && _a !== void 0 ? _a : query === null || query === void 0 ? void 0 : query.action;
    const value = Array.isArray(raw) ? raw[0] : raw;
    return value === "apply" ? "apply" : "dry-run";
}
function normalizeStoredConfidenceKey(value) {
    if (value === undefined || value === null || value === "")
        return null;
    return String(value);
}
function logConfidenceImport(strapi, message, meta) {
    const suffix = meta ? ` ${JSON.stringify(meta)}` : "";
    strapi.log.info(`[result-confidence-key] ${message}${suffix}`);
}
const RESULT_CONFIDENCE_KEY_VALUES = [
    "check_evidence",
    "star_evidence",
    "cap_evidence",
    "caution",
];
async function updateResultConfidenceKey(strapi, documentId, nextKey, logContext) {
    const data = { confidence_key: nextKey };
    try {
        try {
            await strapi.documents("api::result.result").update({
                documentId,
                data,
                status: "published",
            });
        }
        catch (publishedError) {
            await strapi.documents("api::result.result").update({
                documentId,
                data,
            });
            await strapi.documents("api::result.result").publish({ documentId });
        }
        const verified = await strapi.documents("api::result.result").findOne({
            documentId,
            status: "published",
            fields: ["confidence_key", "documentId"],
        });
        const writtenKey = normalizeStoredConfidenceKey(verified === null || verified === void 0 ? void 0 : verified.confidence_key);
        const expectedKey = normalizeStoredConfidenceKey(nextKey);
        if (writtenKey !== expectedKey) {
            const error = `Write verification failed: expected ${expectedKey !== null && expectedKey !== void 0 ? expectedKey : "(null)"}, got ${writtenKey !== null && writtenKey !== void 0 ? writtenKey : "(null)"}`;
            logConfidenceImport(strapi, "write failed", {
                row: logContext.rowNumber,
                documentId,
                result: logContext.resultTitle,
                old_confidence_key: logContext.currentKey,
                new_confidence_key: nextKey,
                success: false,
                error,
            });
            return { success: false, error };
        }
        logConfidenceImport(strapi, "write success", {
            row: logContext.rowNumber,
            documentId,
            result: logContext.resultTitle,
            old_confidence_key: logContext.currentKey,
            new_confidence_key: nextKey,
            success: true,
        });
        return { success: true, writtenKey };
    }
    catch (err) {
        const error = err.message;
        logConfidenceImport(strapi, "write failed", {
            row: logContext.rowNumber,
            documentId,
            result: logContext.resultTitle,
            old_confidence_key: logContext.currentKey,
            new_confidence_key: nextKey,
            success: false,
            error,
        });
        return { success: false, error };
    }
}
async function countPublishedResultConfidenceKeys(strapi) {
    const counts = {
        check_evidence: 0,
        star_evidence: 0,
        cap_evidence: 0,
        caution: 0,
        empty: 0,
    };
    for (const key of RESULT_CONFIDENCE_KEY_VALUES) {
        counts[key] = await strapi.documents("api::result.result").count({
            filters: { confidence_key: { $eq: key } },
            status: "published",
        });
    }
    counts.empty = await strapi.documents("api::result.result").count({
        filters: { confidence_key: { $null: true } },
        status: "published",
    });
    return counts;
}
function getRowValue(record, ...candidates) {
    const normalizedRecord = new Map();
    for (const [key, value] of Object.entries(record)) {
        normalizedRecord.set(normalizeHeader(key), value);
    }
    for (const candidate of candidates) {
        const value = normalizedRecord.get(normalizeHeader(candidate));
        if (value !== undefined)
            return value;
    }
    return "";
}
function stripNotionUrlSuffix(value) {
    return value.replace(/\s*\(https?:\/\/[^\)]*\)?$/i, "").trim();
}
function parseResearchPaperTitles(raw) {
    const trimmed = raw.trim();
    if (!trimmed)
        return [];
    const parts = trimmed.split(/\)\s*,\s*/);
    const titles = parts
        .map((part) => stripNotionUrlSuffix(part))
        .filter(Boolean);
    if (titles.length > 0)
        return titles;
    const singleTitle = stripNotionUrlSuffix(trimmed);
    return singleTitle ? [singleTitle] : [];
}
function normalizeTitleKey(title) {
    return title.toLowerCase().trim();
}
function stripEmojiPresentation(value) {
    return value.replace(/\uFE0E|\uFE0F/g, "").normalize("NFKC");
}
/**
 * Normalize Confidence cells copied from Google Sheets / Notion exports.
 * Stored Strapi values remain enum keys — never raw emoji.
 */
function normalizeConfidenceCell(raw) {
    return stripEmojiPresentation(raw)
        .replace(/\uFEFF/g, "")
        .replace(/[\u200B-\u200D\u2060\u00A0]/g, " ")
        .trim()
        .replace(/^["']+|["']+$/g, "");
}
function confidenceContains(value, emoji) {
    return stripEmojiPresentation(value).includes(stripEmojiPresentation(emoji));
}
function confidenceContainsAny(value, emojis) {
    return emojis.some((emoji) => confidenceContains(value, emoji));
}
function isMemoOnlyConfidence(value) {
    const stripped = stripEmojiPresentation(value).replace(/[\s,;|/\\-]+/g, "");
    if (!stripped)
        return true;
    return /^🗒+$/.test(stripped);
}
function mapConfidenceValueToKey(raw) {
    const value = normalizeConfidenceCell(raw);
    if (!value)
        return { action: "clear" };
    if (VALID_CONFIDENCE_KEYS.has(value)) {
        return { action: "set", key: value };
    }
    const tokens = value
        .split(/[,;|/]+/)
        .map((token) => token.trim())
        .filter(Boolean);
    const searchSpace = (tokens.length > 0 ? tokens : [value]).join(" ");
    const hasMemo = confidenceContains(searchSpace, "🗒");
    const hasFlag = confidenceContains(searchSpace, "🚩");
    const hasCap = confidenceContains(searchSpace, "🎓");
    const hasStar = confidenceContainsAny(searchSpace, ["⭐", "★"]);
    const hasCheck = confidenceContainsAny(searchSpace, ["✅", "✔", "☑"]);
    const hasOther = hasCheck || hasStar || hasCap || hasFlag;
    if (hasMemo &&
        !hasOther &&
        (tokens.length > 0
            ? tokens.every(isMemoOnlyConfidence)
            : isMemoOnlyConfidence(value))) {
        return { action: "clear" };
    }
    if (hasFlag)
        return { action: "set", key: "caution" };
    if (hasCap)
        return { action: "set", key: "cap_evidence" };
    if (hasStar)
        return { action: "set", key: "star_evidence" };
    if (hasCheck)
        return { action: "set", key: "check_evidence" };
    if (hasMemo)
        return { action: "clear" };
    return {
        action: "invalid",
        reason: `Unmapped Confidence value: "${raw.trim()}"`,
    };
}
function resolveImportRowKey(record) {
    const resultTitle = getRowValue(record, "Results").trim();
    const paperTitle = parseResearchPaperTitles(getRowValue(record, "Research Papers", "Title"))[0] ||
        "";
    return `${normalizeTitleKey(resultTitle)}::${normalizeTitleKey(paperTitle)}`;
}
async function findResultForConfidenceImport(strapi, record) {
    var _a;
    const resultTitle = getRowValue(record, "Results").trim();
    const paperTitles = parseResearchPaperTitles(getRowValue(record, "Research Papers", "Title"));
    if (!resultTitle && paperTitles.length === 0) {
        return null;
    }
    const baseQuery = {
        populate: { researchPapers: { fields: ["id", "Title"] } },
        fields: ["documentId", "confidence_key", "title", "slug"],
        status: "published",
    };
    let candidates = [];
    if (resultTitle) {
        const byTitle = await strapi
            .documents("api::result.result")
            .findMany({
            ...baseQuery,
            filters: { title: { $eqi: resultTitle } },
            limit: 25,
        });
        candidates = Array.isArray(byTitle) ? byTitle : [];
        if (candidates.length === 0) {
            const slug = slugify(resultTitle);
            if (slug) {
                const bySlug = await strapi
                    .documents("api::result.result")
                    .findMany({
                    ...baseQuery,
                    filters: { slug },
                    limit: 25,
                });
                candidates = Array.isArray(bySlug) ? bySlug : [];
            }
        }
    }
    if (candidates.length === 0 && paperTitles.length > 0) {
        for (const paperTitle of paperTitles) {
            const papers = await strapi
                .documents("api::research-paper.research-paper")
                .findMany({
                filters: { Title: { $eqi: paperTitle } },
                limit: 1,
                fields: ["id", "Title"],
            });
            if (!((_a = papers === null || papers === void 0 ? void 0 : papers[0]) === null || _a === void 0 ? void 0 : _a.id))
                continue;
            const linked = await strapi.documents("api::result.result").findMany({
                ...baseQuery,
                filters: { researchPapers: { id: papers[0].id } },
                limit: 25,
            });
            if (Array.isArray(linked)) {
                candidates.push(...linked);
            }
        }
    }
    const uniqueCandidates = [
        ...new Map(candidates.map((item) => [item.documentId, item])).values(),
    ];
    if (paperTitles.length > 0 && uniqueCandidates.length > 1) {
        const narrowed = uniqueCandidates.filter((result) => {
            var _a;
            return ((_a = result.researchPapers) !== null && _a !== void 0 ? _a : []).some((paper) => paperTitles.some((title) => { var _a; return ((_a = paper.Title) !== null && _a !== void 0 ? _a : "").trim().toLowerCase() === title.toLowerCase(); }));
        });
        if (narrowed.length > 0) {
            return narrowed.length === 1 ? narrowed[0] : null;
        }
    }
    if (uniqueCandidates.length === 1) {
        return uniqueCandidates[0];
    }
    return null;
}
async function importResultConfidenceKeys(strapi, records, apply) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const stats = {
        total: records.length,
        matched: 0,
        updated: 0,
        unchanged: 0,
        cleared: 0,
        unmatched: 0,
        duplicates: 0,
        applied: apply,
        planned_updates: 0,
        write_success: 0,
        write_failed: 0,
    };
    const errors = [];
    const report = {
        unmatched_rows: [],
        duplicate_rows: [],
        breakdown_by_confidence: createEmptyConfidenceBreakdown(),
    };
    logConfidenceImport(strapi, apply ? "Starting APPLY import" : "Starting DRY-RUN import", { total: records.length });
    const rowKeyCounts = new Map();
    for (const record of records) {
        const rowKey = resolveImportRowKey(record);
        if (!rowKey || rowKey === "::")
            continue;
        rowKeyCounts.set(rowKey, ((_a = rowKeyCounts.get(rowKey)) !== null && _a !== void 0 ? _a : 0) + 1);
    }
    const duplicateRowKeys = new Set([...rowKeyCounts.entries()]
        .filter(([, count]) => count > 1)
        .map(([rowKey]) => rowKey));
    const processedRowKeys = new Set();
    const firstRowMappingByKey = new Map();
    const bumpBreakdown = (label, bucket) => {
        report.breakdown_by_confidence[label][bucket]++;
    };
    for (let index = 0; index < records.length; index++) {
        const record = records[index];
        const rowNumber = index + 2;
        const resultTitle = getRowValue(record, "Results").trim();
        const paperTitleRaw = getRowValue(record, "Research Papers", "Title");
        const paperTitleCleaned = formatCleanedResearchPapers(paperTitleRaw);
        const confidenceRaw = getRowValue(record, "Confidence", "confidence_key");
        const confidenceLabel = classifyConfidenceLabel(confidenceRaw);
        const rowLabel = `Row ${rowNumber}: ${resultTitle || paperTitleRaw || "Unknown"}`;
        const rowKey = resolveImportRowKey(record);
        const mapping = mapConfidenceValueToKey(confidenceRaw);
        const mappedKey = mappingToNextKey(mapping);
        const baseReport = {
            row_number: rowNumber,
            results: resultTitle,
            research_papers_original: paperTitleRaw,
            research_papers_cleaned: paperTitleCleaned,
            confidence: confidenceRaw,
            confidence_label: confidenceLabel,
            mapped_confidence_key: mappedKey === undefined ? null : mappedKey,
        };
        if (!resultTitle && !paperTitleRaw.trim()) {
            const errorReason = "Missing Results and Research Papers / Title";
            stats.unmatched++;
            bumpBreakdown(confidenceLabel, "unmatched");
            errors.push({ row: rowLabel, error: errorReason });
            report.unmatched_rows.push({
                ...baseReport,
                outcome: "unmatched",
                error_reason: errorReason,
            });
            continue;
        }
        if (duplicateRowKeys.has(rowKey) && processedRowKeys.has(rowKey)) {
            const firstMappedKey = firstRowMappingByKey.get(rowKey);
            const duplicateType = firstMappedKey === mappedKey ? "exact" : "conflicting";
            const errorReason = duplicateType === "exact"
                ? "Duplicate row (exact — same Result, paper, and Confidence mapping as first occurrence)"
                : "Duplicate row (conflicting — same Result and paper but different Confidence mapping than first occurrence)";
            stats.duplicates++;
            bumpBreakdown(confidenceLabel, "duplicate");
            errors.push({ row: rowLabel, error: errorReason });
            report.duplicate_rows.push({
                ...baseReport,
                outcome: "duplicate",
                duplicate_type: duplicateType,
                error_reason: errorReason,
            });
            continue;
        }
        processedRowKeys.add(rowKey);
        if (mappedKey !== undefined) {
            firstRowMappingByKey.set(rowKey, mappedKey);
        }
        if (mapping.action === "invalid") {
            stats.unmatched++;
            bumpBreakdown(confidenceLabel, "unmatched");
            errors.push({ row: rowLabel, error: mapping.reason });
            report.unmatched_rows.push({
                ...baseReport,
                outcome: "invalid",
                error_reason: mapping.reason,
            });
            continue;
        }
        const result = await findResultForConfidenceImport(strapi, record);
        if (!result) {
            const errorReason = "No Result matched this row";
            stats.unmatched++;
            bumpBreakdown(confidenceLabel, "unmatched");
            errors.push({ row: rowLabel, error: errorReason });
            report.unmatched_rows.push({
                ...baseReport,
                outcome: "unmatched",
                error_reason: errorReason,
            });
            continue;
        }
        stats.matched++;
        const nextKey = mapping.action === "clear" ? null : mapping.key;
        const currentKey = normalizeStoredConfidenceKey(result.confidence_key);
        const isClearIntent = nextKey === null;
        if (isClearIntent) {
            stats.cleared++;
            bumpBreakdown(confidenceLabel, "cleared");
        }
        if (currentKey === normalizeStoredConfidenceKey(nextKey)) {
            stats.unchanged++;
            if (!isClearIntent) {
                bumpBreakdown(confidenceLabel, "unchanged");
            }
            continue;
        }
        bumpBreakdown(confidenceLabel, "updated");
        stats.planned_updates = ((_b = stats.planned_updates) !== null && _b !== void 0 ? _b : 0) + 1;
        if (!apply) {
            stats.updated++;
            continue;
        }
        const documentId = result.documentId;
        if (!documentId) {
            stats.write_failed = ((_c = stats.write_failed) !== null && _c !== void 0 ? _c : 0) + 1;
            const errorReason = "Result missing documentId — cannot update published Result in Strapi v5";
            errors.push({ row: rowLabel, error: errorReason });
            logConfidenceImport(strapi, "write failed", {
                row: rowNumber,
                documentId: null,
                result: resultTitle,
                old_confidence_key: currentKey,
                new_confidence_key: nextKey,
                success: false,
                error: errorReason,
            });
            continue;
        }
        const writeResult = await updateResultConfidenceKey(strapi, documentId, nextKey, {
            rowNumber,
            resultTitle,
            currentKey,
        });
        if (!writeResult.success) {
            stats.write_failed = ((_d = stats.write_failed) !== null && _d !== void 0 ? _d : 0) + 1;
            errors.push({
                row: rowLabel,
                error: (_e = writeResult.error) !== null && _e !== void 0 ? _e : "Unknown update error",
            });
            continue;
        }
        stats.updated++;
        stats.write_success = ((_f = stats.write_success) !== null && _f !== void 0 ? _f : 0) + 1;
    }
    const verification = apply
        ? await countPublishedResultConfidenceKeys(strapi)
        : undefined;
    if (apply) {
        logConfidenceImport(strapi, "APPLY import finished", {
            planned_updates: (_g = stats.planned_updates) !== null && _g !== void 0 ? _g : 0,
            write_success: (_h = stats.write_success) !== null && _h !== void 0 ? _h : 0,
            write_failed: (_j = stats.write_failed) !== null && _j !== void 0 ? _j : 0,
            verification,
        });
    }
    return { stats, errors, report, verification };
}
// ==================== RESULTS LOGIC ====================
function mapResultRow(csvRow) {
    const strapiRow = {};
    for (const [csvRawKey, raw] of Object.entries(csvRow)) {
        const csvKey = normalizeHeader(csvRawKey);
        const strapiKey = RESULT_SCHEMA[csvKey];
        if (!strapiKey)
            continue;
        strapiRow[strapiKey] = convertValue(raw, RESULT_INTEGER_FIELDS, strapiKey);
    }
    strapiRow.slug = slugify(strapiRow.title);
    return strapiRow;
}
async function processResultRelations(strapi, csvRow, resultId) {
    var _a, _b;
    try {
        // Extract research paper slugs
        const paperIds = csvRow["Research Papers"]
            ? (csvRow["Research Papers"] || "").split(",")
            : [];
        const paperResultIds = [];
        for (const id of paperIds) {
            const papers = await strapi.entityService.findMany("api::research-paper.research-paper", {
                filters: { id: Number(id) },
                limit: 1,
            });
            if (papers && Array.isArray(papers) && ((_a = papers[0]) === null || _a === void 0 ? void 0 : _a.id)) {
                paperResultIds.push(papers[0].id);
            }
        }
        // Extract supplement slugs
        const supplementIds = csvRow["Supplements"]
            ? (csvRow["Supplements"] || "").split(",")
            : [];
        const supplementResultIds = [];
        for (const id of supplementIds) {
            const supplements = await strapi.entityService.findMany("api::supplement.supplement", {
                filters: { id: Number(id) },
                limit: 1,
            });
            if (supplements && Array.isArray(supplements) && ((_b = supplements[0]) === null || _b === void 0 ? void 0 : _b.id)) {
                supplementResultIds.push(supplements[0].id);
            }
        }
        // Update result with relations
        await strapi.entityService.update("api::result.result", resultId, {
            data: {
                researchPapers: paperResultIds,
                supplements: supplementResultIds,
            },
        });
        return { success: true, paperIds, supplementIds };
    }
    catch (err) {
        return { success: false, error: err.message };
    }
}
// ==================== TYPE GUARD ====================
function isCsvRecord(obj) {
    return (typeof obj === "object" &&
        obj !== null &&
        Object.values(obj).every((val) => typeof val === "string"));
}
// ==================== CONTROLLER ====================
exports.default = {
    async import(ctx) {
        var _a, _b, _c;
        try {
            const { files, body } = ctx.request;
            const collection = body.collection || "supplements";
            const action = parseImportAction(ctx);
            if (!files || !files.file) {
                return ctx.badRequest("No file uploaded");
            }
            const file = Array.isArray(files.file) ? files.file[0] : files.file;
            const fileContent = require("fs").readFileSync(file.filepath, "utf8");
            const records = (0, sync_1.parse)(fileContent, {
                columns: true,
                skip_empty_lines: true,
                trim: true,
            });
            if (records.length === 0) {
                return ctx.badRequest("CSV file is empty");
            }
            let success = 0;
            let failed = 0;
            const errors = [];
            // Route to correct collection
            if (collection === "supplements") {
                const firstRecord = records[0];
                if (!isCsvRecord(firstRecord)) {
                    return ctx.badRequest("Invalid CSV format");
                }
                for (const record of records) {
                    if (!isCsvRecord(record))
                        continue;
                    try {
                        const strapiRow = mapSupplementRow(record);
                        const existing = await strapi.entityService.findMany("api::supplement.supplement", {
                            filters: { slug: strapiRow.slug },
                            limit: 1,
                        });
                        if (existing && Array.isArray(existing) && existing.length > 0) {
                            errors.push({
                                row: record.results || "Unknown",
                                error: `Collection for slug: {${strapiRow.slug}} is exist in the database`,
                            });
                            failed++;
                            continue;
                        }
                        else {
                            await strapi.entityService.create("api::supplement.supplement", {
                                data: strapiRow,
                            });
                        }
                        success++;
                    }
                    catch (err) {
                        failed++;
                        errors.push({
                            row: record.supplement_name || "Unknown",
                            error: err.message,
                        });
                    }
                }
            }
            else if (collection === "research-papers") {
                const firstRecord = records[0];
                if (!isCsvRecord(firstRecord)) {
                    return ctx.badRequest("Invalid CSV format");
                }
                for (const record of records) {
                    if (!isCsvRecord(record))
                        continue;
                    try {
                        const strapiRow = mapResearchPaperRow(record);
                        const existing = await strapi.entityService.findMany("api::research-paper.research-paper", {
                            filters: { slug: strapiRow.slug },
                            limit: 1,
                        });
                        if (existing && Array.isArray(existing) && existing.length > 0) {
                            errors.push({
                                row: record.results || "Unknown",
                                error: `Collection for slug: {${strapiRow.slug}} is exist in the database`,
                            });
                            failed++;
                            continue;
                        }
                        else {
                            await strapi.entityService.create("api::research-paper.research-paper", { data: strapiRow });
                        }
                        success++;
                    }
                    catch (err) {
                        failed++;
                        errors.push({
                            row: record.Title || "Unknown",
                            error: err.message,
                        });
                    }
                }
            }
            else if (collection === "results") {
                const firstRecord = records[0];
                if (!isCsvRecord(firstRecord)) {
                    return ctx.badRequest("Invalid CSV format");
                }
                const insertedIds = {};
                // First pass: insert main data
                for (const record of records) {
                    if (!isCsvRecord(record))
                        continue;
                    try {
                        const strapiRow = mapResultRow(record);
                        const existing = await strapi.entityService.findMany("api::result.result", {
                            filters: { slug: strapiRow.slug },
                            limit: 1,
                        });
                        let resultId;
                        if (existing && Array.isArray(existing) && existing.length > 0) {
                            errors.push({
                                row: record.results || "Unknown",
                                error: `Collection for slug: {${strapiRow.slug}} is exist in the database`,
                            });
                            failed++;
                            continue;
                        }
                        else {
                            const created = await strapi.entityService.create("api::result.result", { data: strapiRow });
                            resultId = created.id;
                        }
                        insertedIds[strapiRow.slug] = resultId;
                        success++;
                    }
                    catch (err) {
                        failed++;
                        errors.push({
                            row: record.results || "Unknown",
                            error: err.message,
                        });
                    }
                }
                // Second pass: update relations
                for (const record of records) {
                    if (!isCsvRecord(record))
                        continue;
                    const strapiRow = mapResultRow(record);
                    const resultId = insertedIds[strapiRow.slug];
                    if (resultId) {
                        await processResultRelations(strapi, record, resultId);
                    }
                }
            }
            else if (collection === "result-confidence-key" ||
                collection === "research-paper-confidence-key") {
                const firstRecord = records[0];
                if (!isCsvRecord(firstRecord)) {
                    return ctx.badRequest("Invalid CSV format");
                }
                const csvRecords = records.filter(isCsvRecord);
                const apply = action === "apply";
                strapi.log.info(`[import-export] result-confidence-key import received action=${action} apply=${apply} dryRun=${!apply}`);
                const { stats: confidenceStats, errors: confidenceErrors, report: confidenceReport, verification: confidenceVerification, } = await importResultConfidenceKeys(strapi, csvRecords, apply);
                const writeSuccess = (_a = confidenceStats.write_success) !== null && _a !== void 0 ? _a : 0;
                const writeFailed = (_b = confidenceStats.write_failed) !== null && _b !== void 0 ? _b : 0;
                const plannedUpdates = (_c = confidenceStats.planned_updates) !== null && _c !== void 0 ? _c : 0;
                return ctx.send({
                    success: apply ? writeFailed === 0 : true,
                    message: apply
                        ? writeFailed === 0
                            ? `Result confidence_key import applied (${writeSuccess} written, ${plannedUpdates} planned)`
                            : `Result confidence_key import finished with ${writeFailed} failed write(s) (${writeSuccess} written of ${plannedUpdates} planned)`
                        : "Result confidence_key dry-run completed (no changes written)",
                    mode: action,
                    dryRun: !apply,
                    applied: apply,
                    stats: confidenceStats,
                    report: confidenceReport,
                    verification: confidenceVerification,
                    errors: confidenceErrors.length > 0 ? confidenceErrors : undefined,
                });
            }
            return ctx.send({
                success: true,
                message: "Import completed",
                stats: { total: records.length, success, failed },
                errors: errors.length > 0 ? errors : undefined,
            });
        }
        catch (error) {
            return ctx.internalServerError("Import failed: " + error.message);
        }
    },
    async export(ctx) {
        try {
            const { collection } = ctx.query;
            let data;
            let filename;
            if (collection === "research-papers") {
                data = await strapi.entityService.findMany("api::research-paper.research-paper", {
                    fields: "*",
                    sort: { Title: "asc" },
                });
                filename = `research-papers-export-${Date.now()}.csv`;
            }
            else if (collection === "results") {
                data = await strapi.entityService.findMany("api::result.result", {
                    fields: "*",
                    sort: { slug: "asc" },
                });
                filename = `results-export-${Date.now()}.csv`;
            }
            else {
                data = await strapi.entityService.findMany("api::supplement.supplement", {
                    fields: "*",
                    sort: { supplement_name: "asc" },
                });
                filename = `supplements-export-${Date.now()}.csv`;
            }
            const dataArray = Array.isArray(data) ? data : [data];
            if (!dataArray || dataArray.length === 0) {
                return ctx.badRequest("No data found to export");
            }
            const csvData = (0, sync_2.stringify)(dataArray, {
                header: true,
                columns: Object.keys(dataArray[0]).filter((key) => key !== "id" &&
                    key !== "createdAt" &&
                    key !== "updatedAt" &&
                    key !== "publishedAt"),
            });
            ctx.set("Content-Type", "text/csv");
            ctx.set("Content-Disposition", `attachment; filename=${filename}`);
            return ctx.send(csvData);
        }
        catch (error) {
            return ctx.internalServerError("Export failed: " + error.message);
        }
    },
    async collections(ctx) {
        return ctx.send({
            collections: [
                { id: "supplements", label: "Supplements" },
                { id: "research-papers", label: "Research Papers" },
                { id: "result-confidence-key", label: "Result confidence_key" },
                { id: "results", label: "Results" },
            ],
        });
    },
};

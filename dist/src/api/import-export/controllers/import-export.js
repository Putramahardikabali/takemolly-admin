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
        fields: ["id", "confidence_key", "title", "slug"],
    };
    let candidates = [];
    if (resultTitle) {
        const byTitle = await strapi.entityService.findMany("api::result.result", {
            ...baseQuery,
            filters: { title: { $eqi: resultTitle } },
            limit: 25,
        });
        candidates = Array.isArray(byTitle) ? byTitle : [];
        if (candidates.length === 0) {
            const slug = slugify(resultTitle);
            if (slug) {
                const bySlug = await strapi.entityService.findMany("api::result.result", {
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
            const papers = await strapi.entityService.findMany("api::research-paper.research-paper", {
                filters: { Title: { $eqi: paperTitle } },
                limit: 1,
                fields: ["id", "Title"],
            });
            if (!((_a = papers === null || papers === void 0 ? void 0 : papers[0]) === null || _a === void 0 ? void 0 : _a.id))
                continue;
            const linked = await strapi.entityService.findMany("api::result.result", {
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
        ...new Map(candidates.map((item) => [item.id, item])).values(),
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
    var _a, _b;
    const stats = {
        total: records.length,
        matched: 0,
        updated: 0,
        unchanged: 0,
        cleared: 0,
        unmatched: 0,
        duplicates: 0,
    };
    const errors = [];
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
    for (const record of records) {
        const resultTitle = getRowValue(record, "Results").trim();
        const paperTitleRaw = getRowValue(record, "Research Papers", "Title");
        const confidenceRaw = getRowValue(record, "Confidence", "confidence_key");
        const rowLabel = resultTitle || paperTitleRaw || "Unknown";
        const rowKey = resolveImportRowKey(record);
        if (!resultTitle && !paperTitleRaw.trim()) {
            stats.unmatched++;
            errors.push({
                row: rowLabel,
                error: "Missing Results and Research Papers / Title",
            });
            continue;
        }
        if (duplicateRowKeys.has(rowKey)) {
            if (processedRowKeys.has(rowKey)) {
                stats.duplicates++;
                continue;
            }
        }
        processedRowKeys.add(rowKey);
        const mapping = mapConfidenceValueToKey(confidenceRaw);
        if (mapping.action === "invalid") {
            errors.push({ row: rowLabel, error: mapping.reason });
            continue;
        }
        const result = await findResultForConfidenceImport(strapi, record);
        if (!result) {
            stats.unmatched++;
            errors.push({
                row: rowLabel,
                error: "No Result matched this row",
            });
            continue;
        }
        stats.matched++;
        const nextKey = mapping.action === "clear" ? null : mapping.key;
        const currentKey = (_b = result.confidence_key) !== null && _b !== void 0 ? _b : null;
        if (currentKey === nextKey) {
            stats.unchanged++;
            continue;
        }
        if (nextKey === null) {
            stats.cleared++;
        }
        if (apply) {
            await strapi.entityService.update("api::result.result", result.id, {
                data: { confidence_key: nextKey },
            });
        }
        stats.updated++;
    }
    return { stats, errors };
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
        try {
            const { files, body } = ctx.request;
            const collection = body.collection || "supplements";
            const action = body.action === "apply" ? "apply" : "dry-run";
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
                const { stats: confidenceStats, errors: confidenceErrors } = await importResultConfidenceKeys(strapi, csvRecords, action === "apply");
                return ctx.send({
                    success: true,
                    message: action === "apply"
                        ? "Result confidence_key import applied"
                        : "Result confidence_key dry-run completed (no changes written)",
                    dryRun: action !== "apply",
                    stats: confidenceStats,
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

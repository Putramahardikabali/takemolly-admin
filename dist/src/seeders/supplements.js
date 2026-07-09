"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSupplements = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sync_1 = require("csv-parse/sync");
const SUPPLEMENT_SYMBOLS = {
    "l-carnitine": "L-Ca",
    curcumin: "Cu",
    magnesium: "Mg",
    saffron: "Saf",
    melatonin: "Mel",
};
const SUPPLEMENT_COLORS = {
    "l-carnitine": "rgba(255, 212, 101, 1)", // #FFD465
    curcumin: "rgba(122, 175, 255, 0.8)", // #7AAFFFCC
    magnesium: "rgba(146, 250, 231, 0.8)", // #92FAE7CC
    saffron: "rgba(255, 233, 234, 0.8)", // #FFE9EACC
    melatonin: "rgba(255, 255, 255, 0.8)", // #FFFFFFCC
};
const SUPPLEMENT_BORDER_COLORS = {
    "l-carnitine": "rgba(234, 145, 248, 0.8)", // #EA91F8CC
    curcumin: "rgba(145, 248, 229, 0.8)", // #91F8E5CC
    magnesium: "rgba(252, 251, 99, 0.8)", // #FCFB63CC
    saffron: "rgba(255, 153, 162, 0.8)", // #FF99A2CC
    melatonin: "rgba(80, 227, 229, 0.8)", // #50E3E5CC
};
const SUPPLEMENT_DESCRIPTION = {
    "l-carnitine": "L-carnitine supplementation appears to be effective in reducing muscle damage, soreness, and oxidative stress following exercise, thereby enhancing overall recovery.",
    curcumin: "Curcumin supplementation appears to offer several benefits for exercise recovery, including reduced muscle damage and soreness, anti-inflammatory and antioxidant effects, thereby improving performance recovery.",
    magnesium: "Magnesium supplementation aids exercise recovery by reducing muscle soreness, inflammation, and muscle damage. It also improves sleep quality and regulates cortisol levels, supporting tissue repair and energy.",
    saffron: "Saffron supplementation can improve exercise recovery by reducing muscle damage and soreness, and enhance sleep quality through increased melatonin production.",
    melatonin: "Melatonin improves sleep quality and quantity, which is critical for recovery. Better sleep leads to enhanced physical and cognitive performance the following day.",
};
const HEADER_SCHEMA = {
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
// Fields that should be integers
const INTEGER_FIELDS = [
    "dosage_cortisol",
    "dosage_inflammation",
    "dosage_muscle_damage",
    "dosage_muscle_soreness",
    "dosage_oxidative_stress",
    "dosage_pain",
    "dosage_sleep_quality",
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
// Fields that should remain as strings (grade_score_*, tldr_*, stats, etc.)
const STRING_FIELDS = [
    "grade_score_cortisol",
    "grade_score_inflammation",
    "grade_score_muscle_damage",
    "grade_score_muscle_soreness",
    "grade_score_oxidative_stress",
    "grade_score_pain",
    "grade_score_sleep_quality",
    "stats",
];
// Clean non-breaking spaces, zero-width spaces, etc.
function normalizeHeader(header) {
    return header
        .trim()
        .replace(/\u00A0/g, "")
        .replace(/\u200B/g, "");
}
function extractNotionSlug(value) {
    if (!value)
        return value;
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}
// Build a dynamic CSV-header-to-Strapi map
function buildDynamicMap(csvHeaders) {
    const map = {};
    for (const rawHeader of csvHeaders) {
        const header = normalizeHeader(rawHeader);
        let mapped = HEADER_SCHEMA[header];
        if (!mapped)
            continue;
        console.log(`Mapped (normalized) "${header}" → "${mapped}"`);
        map[header] = mapped;
    }
    map.slug = "slug";
    map.symbol = "symbol";
    map.color = "color";
    map.border_color = "border_color";
    map.is_our_supplement = "is_our_supplement";
    map.description = "description";
    return map;
}
// Convert CSV → Strapi row safely
function mapCsvRowToStrapiRow(csvRow, csvToStrapiMap) {
    const strapiRow = {};
    for (const [csvRawKey, raw] of Object.entries(csvRow)) {
        const strapiKey = csvToStrapiMap[normalizeHeader(csvRawKey)];
        if (!strapiKey)
            continue;
        let value = raw;
        // Convert Yes/No → boolean
        if (raw === "Yes") {
            value = true;
        }
        else if (raw === "No") {
            value = false;
        }
        else if (raw.trim() === "") {
            value = null;
        }
        else if (INTEGER_FIELDS.includes(strapiKey)) {
            // Convert to integer for numeric fields
            const parsed = parseInt(raw, 10);
            value = isNaN(parsed) ? null : parsed;
        }
        else if (STRING_FIELDS.includes(strapiKey)) {
            // Keep as string
            value = raw;
        }
        // Otherwise keep as string (default)
        strapiRow[strapiKey] = value;
    }
    strapiRow.slug = extractNotionSlug(strapiRow.supplement_name);
    strapiRow.symbol = SUPPLEMENT_SYMBOLS[strapiRow.slug] || "";
    strapiRow.color = SUPPLEMENT_COLORS[strapiRow.slug] || "#FFD465";
    strapiRow.border_color =
        SUPPLEMENT_BORDER_COLORS[strapiRow.slug] ||
            "rgba(234, 145, 248, 0.8)";
    strapiRow.is_our_supplement = SUPPLEMENT_SYMBOLS[strapiRow.slug]
        ? true
        : false;
    strapiRow.description =
        SUPPLEMENT_DESCRIPTION[strapiRow.slug] || "";
    return strapiRow;
}
const seedSupplements = async (strapi) => {
    console.log("=== Starting Strapi Supplements Seeder ===");
    // Load CSV raw text - Strapi runs from project root
    const csvPath = path_1.default.join(process.cwd(), "src/seeders/csv/supplements.csv");
    console.log("Reading CSV:", csvPath);
    const fileContent = fs_1.default.readFileSync(csvPath, "utf8");
    // Sync parse is 100% reliable
    const records = (0, sync_1.parse)(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });
    console.log(`✓ Loaded ${records.length} rows`);
    if (records.length === 0) {
        console.log("❌ CSV contains zero records.");
        return;
    }
    const csvHeaders = Object.keys(records[0]);
    console.log("CSV Headers:", csvHeaders);
    // Build dynamic map
    const csvToStrapiMap = buildDynamicMap(csvHeaders);
    console.log("Column Map:", csvToStrapiMap);
    let success = 0;
    let failed = 0;
    // Insert all supplements
    for (const csvRow of records) {
        const strapiRow = mapCsvRowToStrapiRow(csvRow, csvToStrapiMap);
        try {
            await strapi.entityService.create("api::supplement.supplement", {
                data: strapiRow,
            });
            success++;
            //   console.log(`✓ Inserted supplement: ${strapiRow.slug} (ID: ${created.id})`)
        }
        catch (err) {
            failed++;
            console.error("❌ Insert failed:", err.message);
            console.error("Row:", strapiRow);
        }
    }
    console.log("=== SEED COMPLETE ===");
    console.log("Inserted:", success);
    console.log("Failed:", failed);
};
exports.seedSupplements = seedSupplements;
// Export untuk digunakan di Strapi lifecycle
exports.default = exports.seedSupplements;

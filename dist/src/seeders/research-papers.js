"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedResearchPapers = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sync_1 = require("csv-parse/sync");
// Schema definition untuk validasi
const SCHEMA = {
    // String fields
    URL: "string",
    Title: "string",
    Label: "string",
    Product: "string",
    Supplement: "string",
    Year: "string",
    Effect: "string",
    Area: "string",
    BodyType: "string",
    Age: "string",
    Confidence: "string",
    CreatedTime: "string",
    LastEditedTime: "string",
    FilesAndMedia: "string",
    Sex: "string",
    TrialDesign: "string",
    TrialLength: "string",
    slug: "string",
    // Text fields (long text)
    TLDR: "text",
    FundingNotes: "text",
    Source: "text",
    Participants: "text",
    RelatedToResults1: "text",
    RelatedToResults2: "text",
    Results: "text",
    // Boolean fields
    AMEND: "boolean",
    FitnessCleaning: "boolean",
    CortisolExerciseCleaning: "boolean",
    MetaChecked: "boolean",
    NULL: "boolean",
    // Integer fields
    NumberOfParticipants: "integer",
    ParticipantsCortisol: "integer",
    ParticipantsInflammation: "integer",
    ParticipantsMuscleDamage: "integer",
    ParticipantsMuscleSoreness: "integer",
    ParticipantsOxidativeStress: "integer",
    ParticipantsPain: "integer",
    ParticipantsSleepQuality: "integer",
    StudiesCortisol: "integer",
    StudiesInflammation: "integer",
    StudiesMuscleDamage: "integer",
    StudiesMuscleSoreness: "integer",
    StudiesOxidativeStress: "integer",
    StudiesPain: "integer",
    StudiesSleepQuality: "integer",
};
const HEADER_SCHEMA = {
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
// Clean non-breaking spaces, zero-width spaces, etc.
function normalizeHeader(header) {
    return header
        .trim()
        .replace(/\u00A0/g, "")
        .replace(/\u200B/g, "");
}
// Konversi dan validasi nilai sesuai tipe
function convertToType(value, type, fieldName) {
    // Handle empty values
    if (value === null || value === undefined || value.trim() === "") {
        return null;
    }
    const trimmed = value.trim();
    try {
        switch (type) {
            case "string":
            case "text":
                return trimmed;
            case "boolean":
                if (trimmed.toLowerCase() === "yes" ||
                    trimmed === "true" ||
                    trimmed === "1") {
                    return true;
                }
                if (trimmed.toLowerCase() === "no" ||
                    trimmed === "false" ||
                    trimmed === "0") {
                    return false;
                }
                // If not recognizable boolean, return null
                return null;
            case "integer":
                // Remove any non-numeric characters except minus sign
                const cleaned = trimmed.replace(/[^0-9-]/g, "");
                if (cleaned === "" || cleaned === "-") {
                    return null;
                }
                const num = parseInt(cleaned, 10);
                if (isNaN(num)) {
                    console.warn(`⚠️  Invalid integer for ${fieldName}: "${value}" → null`);
                    return null;
                }
                return num;
            default:
                return trimmed;
        }
    }
    catch (err) {
        console.warn(`⚠️  Conversion error for ${fieldName} (${type}): ${value} → null`);
        return null;
    }
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
function short(v, max = 200) {
    if (v == null)
        return String(v);
    const s = String(v);
    return s.length > max ? `${s.slice(0, max)}...(${s.length} chars)` : s;
}
// Build a dynamic CSV-header-to-Strapi map
function buildDynamicMap(csvHeaders) {
    const map = {};
    for (const rawHeader of csvHeaders) {
        const header = normalizeHeader(rawHeader);
        let mapped;
        mapped = HEADER_SCHEMA[header];
        if (!mapped)
            continue;
        console.log(`Mapped (normalized) "${rawHeader}" → "${mapped}"`);
        map[rawHeader] = mapped;
    }
    map.slug = "slug";
    return map;
}
// Convert CSV → Strapi row dengan validasi tipe
function mapCsvRowToStrapiRow(csvRow, csvToStrapiMap) {
    const strapiRow = {};
    for (const [csvRawKey, raw] of Object.entries(csvRow)) {
        const strapiKey = csvToStrapiMap[normalizeHeader(csvRawKey)];
        if (!strapiKey)
            continue;
        // Get expected type from schema
        const expectedType = SCHEMA[strapiKey];
        if (expectedType) {
            // Convert to proper type
            const convertedValue = convertToType(raw, expectedType, strapiKey);
            strapiRow[strapiKey] = convertedValue;
        }
        else {
            // Unknown field, keep as string
            strapiRow[strapiKey] = raw.trim() || null;
        }
    }
    // Generate slug from Title
    const rawTitle = typeof strapiRow.Title === "string" ? strapiRow.Title : "";
    strapiRow.slug = extractNotionSlug(rawTitle || "");
    console.log("→ Row processed: title:", short(strapiRow.Title), ", slug:", strapiRow.slug);
    return strapiRow;
}
const seedResearchPapers = async (strapi) => {
    console.log("=== Starting Strapi Research Papers Seeder ===");
    // Load CSV raw text - Strapi runs from project root
    const csvPath = path_1.default.join(process.cwd(), "src/seeders/csv/papers.csv");
    console.log("Reading CSV:", csvPath);
    const fileContent = fs_1.default.readFileSync(csvPath, "utf8");
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
    const csvToStrapiMap = buildDynamicMap(csvHeaders);
    console.log("Column Map:", csvToStrapiMap);
    console.log("=== Starting Insert ===");
    let success = 0;
    let failed = 0;
    let rowIndex = 0;
    for (const csvRow of records) {
        rowIndex++;
        try {
            const strapiRow = mapCsvRowToStrapiRow(csvRow, csvToStrapiMap);
            // Optional: Log data types before insert (untuk debugging)
            if (rowIndex === 1) {
                console.log("\n--- Sample Data Types (Row 1) ---");
                for (const [key, value] of Object.entries(strapiRow)) {
                    console.log(`${key}: ${typeof value} = ${short(value, 50)}`);
                }
            }
            const startTime = Date.now();
            try {
                await strapi.entityService.create("api::research-paper.research-paper", {
                    data: strapiRow,
                });
                if (rowIndex % 10 === 0) {
                    console.log(`✓ Inserted ${rowIndex} rows (last: ${strapiRow.slug})`);
                }
                success++;
            }
            catch (nativeErr) {
                const elapsed = Date.now() - startTime;
                console.log(`--- AFTER insert (Row ${rowIndex}) FAILED (${elapsed}ms) ---`);
                console.error(`❌ Strapi Error on row ${rowIndex}:`, nativeErr.message);
                console.error("Data:", short(JSON.stringify(strapiRow), 300));
                failed++;
                continue;
            }
        }
        catch (err) {
            failed++;
            console.error(`❌ Insert failed at row ${rowIndex}:`, err.message);
            console.error("CSV Row:", short(JSON.stringify(csvRow), 300));
        }
    }
    console.log("\n=== SEED COMPLETE ===");
    console.log("✅ Inserted:", success);
    console.log("❌ Failed:", failed);
    console.log("📊 Total:", records.length);
};
exports.seedResearchPapers = seedResearchPapers;
// Export untuk digunakan di Strapi lifecycle
exports.default = exports.seedResearchPapers;

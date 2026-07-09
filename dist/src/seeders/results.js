"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedResults = exports.HEADER_SCHEMA = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sync_1 = require("csv-parse/sync");
// Schema definition untuk validasi
const SCHEMA = {
    // String fields
    product: "string",
    mainTag: "string",
    subTag: "string",
    benefit: "string",
    sex: "string",
    bodyType: "string",
    confidence: "string",
    trialDesign: "string",
    trialLength: "string",
    slug: "string",
    // Text fields
    results: "text",
    // Integer fields
    benefitValue: "integer",
    score: "integer",
    participants: "integer",
    age: "integer",
    maxPain: "integer",
    year: "integer",
    // Boolean fields
    oxidativeStressFilter: "boolean",
    muscleDamageFilter: "boolean",
    muscleSorenessFilter: "boolean",
    inflammationFilter: "boolean",
    painFilter: "boolean",
    sleepQualityFilter: "boolean",
    cortisolFilter: "boolean",
    cortisolCleaning: "boolean",
};
exports.HEADER_SCHEMA = {
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
                return null;
            case "integer":
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
// Clean CSV headers → Strapi-safe keys
function normalizeHeader(header) {
    return header
        .trim()
        .replace(/\u00A0/g, "")
        .replace(/\u200B/g, "");
}
function slugify(str) {
    return str
        .trim()
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase();
}
function extractNotionSlug(value, extractNotion = false) {
    if (!value || typeof value === "boolean")
        return "";
    value = value.toString();
    if (!extractNotion)
        return slugify(value);
    const match = value.match(/\((https:\/\/www\.notion\.so\/([^?]+))/);
    if (!match) {
        return value.split("(")[0].trim();
    }
    return slugify(match[2]);
}
// Build a dynamic CSV-header-to-Strapi map
function buildDynamicMap(csvHeaders) {
    const map = {};
    for (const rawHeader of csvHeaders) {
        // Clean non-breaking spaces, zero-width spaces, etc.
        const header = normalizeHeader(rawHeader);
        const mapped = exports.HEADER_SCHEMA[header];
        if (!mapped)
            continue;
        console.log(`Mapped "${header}" → "${mapped}"`);
        map[header] = mapped;
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
            // Unknown field, keep as string or null
            strapiRow[strapiKey] = raw.trim() || null;
        }
    }
    // Generate slug from results field
    strapiRow.slug = extractNotionSlug(strapiRow.title);
    return strapiRow;
}
async function loadEntityCache(strapi) {
    const [allSupps, allPapers] = await Promise.all([
        strapi.entityService.findMany("api::supplement.supplement", {
            fields: ["id", "slug"],
            limit: -1,
        }),
        strapi.entityService.findMany("api::research-paper.research-paper", {
            fields: ["id", "slug"],
            limit: -1,
        }),
    ]);
    const dedupe = (rows) => {
        const out = [];
        const seen = new Set();
        for (const r of rows) {
            if (!r.slug)
                continue;
            if (seen.has(r.slug))
                continue;
            seen.add(r.slug);
            out.push({ id: r.id, slug: r.slug });
        }
        // Prefer shorter slugs first so fuzzy matches pick the tightest one.
        out.sort((a, b) => a.slug.length - b.slug.length);
        return out;
    };
    const supplements = dedupe(allSupps);
    const papers = dedupe(allPapers);
    return {
        supplements,
        supplementBySlug: new Map(supplements.map((s) => [s.slug, s])),
        papers,
        paperBySlug: new Map(papers.map((p) => [p.slug, p])),
    };
}
// Resolve a CSV-derived supplement slug to an entity id.
// 1. Exact slug match.
// 2. Fuzzy: either side substring (e.g. "theanine" ↔ "l-theanine"). We pick
//    the shortest candidate slug to bias toward the closest match.
function findSupplementId(cache, csvSlug) {
    if (!csvSlug)
        return null;
    const exact = cache.supplementBySlug.get(csvSlug);
    if (exact)
        return { id: exact.id, matchedSlug: exact.slug, fuzzy: false };
    for (const s of cache.supplements) {
        if (s.slug.includes(csvSlug) || csvSlug.includes(s.slug)) {
            return { id: s.id, matchedSlug: s.slug, fuzzy: true };
        }
    }
    return null;
}
// Resolve a CSV-derived paper title (slugified) to an entity id.
// 1. Exact slug match.
// 2. Either side substring against stored paper.slug (also stored as
//    slugified title, so substring usually wins on minor wording deltas).
function findPaperId(cache, titleSlug) {
    if (!titleSlug)
        return null;
    const exact = cache.paperBySlug.get(titleSlug);
    if (exact)
        return { id: exact.id, matchedSlug: exact.slug, fuzzy: false };
    for (const p of cache.papers) {
        if (p.slug.includes(titleSlug) || titleSlug.includes(p.slug)) {
            return { id: p.id, matchedSlug: p.slug, fuzzy: true };
        }
    }
    return null;
}
// Parse the Notion-style "Research Papers" cell: each entry is
//   "Some Title (https://www.notion.so/Some-Title-HASH?pvs=21)"
// possibly comma/semicolon/newline separated. Comma-in-title is common, so
// we anchor on the URL paren pattern instead of naively splitting by comma.
function extractPaperTitleSlugs(raw) {
    if (!raw)
        return [];
    const refs = [];
    const re = /([^(]+?)\s*\(https:\/\/www\.notion\.so\/[^)]+\)/g;
    let m;
    while ((m = re.exec(raw)) !== null) {
        const title = m[1].replace(/^[\s,;]+|[\s,;]+$/g, "");
        if (title)
            refs.push(slugify(title));
    }
    if (refs.length > 0)
        return refs;
    // Fallback when no Notion URLs are present.
    return raw
        .split(/[,;\n]+/)
        .map((s) => slugify(s.trim()))
        .filter(Boolean);
}
function extractSupplementSlugs(raw) {
    if (!raw)
        return [];
    return raw
        .split(/[,;\n]+/)
        .map((s) => slugify(s.trim()))
        .filter(Boolean);
}
const seedResults = async (strapi) => {
    console.log("=== Starting Strapi Results Seeder ===");
    // Load CSV raw text - Strapi runs from project root
    const csvPath = path_1.default.join(process.cwd(), "src/seeders/csv/results.csv");
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
    // Pre-build all rows ONCE so insert + relation passes share the same slug
    const builtRows = records.map((csvRow) => mapCsvRowToStrapiRow(csvRow, csvToStrapiMap));
    // Strapi's `slug` is a uid (varchar(255), unique). The CSV-derived slug
    // is built from the full Results text which often exceeds 255 chars and
    // may collide across rows (same finding under multiple Main Tags).
    // Truncate to 240 chars (leaving room for a uniqueness suffix) and append
    // `-2`, `-3`, ... on collision.
    const SLUG_MAX = 240;
    const usedSlugs = new Set();
    const makeUniqueSlug = (base) => {
        const safe = (base || "").slice(0, SLUG_MAX);
        if (safe && !usedSlugs.has(safe)) {
            usedSlugs.add(safe);
            return safe;
        }
        let i = 2;
        while (true) {
            const suffix = `-${i}`;
            const candidate = safe.slice(0, SLUG_MAX - suffix.length) + suffix;
            if (!usedSlugs.has(candidate)) {
                usedSlugs.add(candidate);
                return candidate;
            }
            i++;
        }
    };
    for (const r of builtRows) {
        r.slug = makeUniqueSlug(r.slug);
    }
    console.log("\n=== Starting Insert ===");
    let success = 0;
    let failed = 0;
    // Insert main records. Track inserted IDs by row index so the relation
    // pass can find them even if the slug had to be deduped.
    const insertedIds = new Array(builtRows.length).fill(null);
    for (let i = 0; i < builtRows.length; i++) {
        const strapiRow = builtRows[i];
        const rowIndex = i + 1;
        try {
            // Optional: Log data types for first row
            if (rowIndex === 1) {
                console.log("\n--- Sample Data Types (Row 1) ---");
                for (const [key, value] of Object.entries(strapiRow)) {
                    const valueStr = value === null
                        ? "null"
                        : typeof value === "string"
                            ? `"${value.substring(0, 30)}..."`
                            : String(value);
                    console.log(`${key}: ${typeof value} = ${valueStr}`);
                }
                console.log("");
            }
            const created = await strapi.entityService.create("api::result.result", {
                data: strapiRow,
            });
            insertedIds[i] = created.id;
            success++;
            if (rowIndex % 10 === 0) {
                console.log(`✓ Inserted ${rowIndex} results`);
            }
        }
        catch (err) {
            failed++;
            console.error(`❌ Insert failed at row ${rowIndex}:`, err.message);
            console.error("Row data:", JSON.stringify(records[i]).substring(0, 200));
        }
    }
    console.log("\n=== Inserting Relations ===");
    // Pre-load supplements + papers once so we don't hit the DB per row
    const cache = await loadEntityCache(strapi);
    console.log(`📦 Cache: ${cache.supplements.length} supplements, ${cache.papers.length} papers`);
    let relationSuccess = 0;
    let relationFailed = 0;
    let paperExact = 0;
    let paperFuzzy = 0;
    let paperMissing = 0;
    let suppExact = 0;
    let suppFuzzy = 0;
    let suppMissing = 0;
    const missingPaperSlugs = new Set();
    const missingSuppSlugs = new Set();
    // Insert relations (using row index → inserted id mapping)
    for (let i = 0; i < records.length; i++) {
        const csvRow = records[i];
        const strapiRow = builtRows[i];
        const resultId = insertedIds[i];
        if (!resultId) {
            // Already counted in failed; skip relation update
            continue;
        }
        try {
            // Research papers
            const paperSlugs = extractPaperTitleSlugs(csvRow["Research Papers"] || "");
            const paperIds = [];
            for (const pSlug of paperSlugs) {
                const match = findPaperId(cache, pSlug);
                if (!match) {
                    paperMissing++;
                    missingPaperSlugs.add(pSlug);
                    continue;
                }
                if (match.fuzzy)
                    paperFuzzy++;
                else
                    paperExact++;
                paperIds.push(match.id);
            }
            // Supplements
            const suppRaw = csvRow["Supplement"] || "";
            const suppSlugs = extractSupplementSlugs(suppRaw);
            const suppIds = [];
            for (const sSlug of suppSlugs) {
                const match = findSupplementId(cache, sSlug);
                if (!match) {
                    suppMissing++;
                    missingSuppSlugs.add(sSlug);
                    continue;
                }
                if (match.fuzzy)
                    suppFuzzy++;
                else
                    suppExact++;
                suppIds.push(match.id);
            }
            // Update result with relations
            await strapi.entityService.update("api::result.result", resultId, {
                data: {
                    researchPapers: paperIds,
                    supplements: suppIds,
                },
            });
            relationSuccess++;
            if (relationSuccess % 10 === 0) {
                console.log(`✓ Updated relations for ${relationSuccess} results`);
            }
        }
        catch (err) {
            relationFailed++;
            console.error(`❌ Relation update failed for ${strapiRow.slug}:`, err.message);
        }
    }
    console.log("\n=== SEED COMPLETE ===");
    console.log("📊 Main Records:");
    console.log("  ✅ Inserted:", success);
    console.log("  ❌ Failed:", failed);
    console.log("  📈 Total:", records.length);
    console.log("\n🔗 Relations:");
    console.log("  ✅ Updated:", relationSuccess);
    console.log("  ❌ Failed:", relationFailed);
    console.log("\n📎 Paper links:");
    console.log("  exact:", paperExact, "fuzzy:", paperFuzzy, "missing:", paperMissing);
    console.log("\n💊 Supplement links:");
    console.log("  exact:", suppExact, "fuzzy:", suppFuzzy, "missing:", suppMissing);
    if (missingSuppSlugs.size > 0) {
        console.log("\n⚠️  Unmatched supplement slugs (sample):", Array.from(missingSuppSlugs).slice(0, 20).join(", "));
    }
    if (missingPaperSlugs.size > 0) {
        console.log("\n⚠️  Unmatched paper slugs (sample):", Array.from(missingPaperSlugs).slice(0, 20).join(", "));
    }
};
exports.seedResults = seedResults;
// Export untuk digunakan di Strapi lifecycle
exports.default = exports.seedResults;

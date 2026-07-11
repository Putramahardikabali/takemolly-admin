import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import type { Context } from "koa";

// ==================== SUPPLEMENTS ====================

const SUPPLEMENT_SYMBOLS: Record<string, string> = {
  "l-carnitine": "L-Ca",
  curcumin: "Cu",
  magnesium: "Mg",
  saffron: "Saf",
  melatonin: "Mel",
};

const SUPPLEMENT_COLORS: Record<string, string> = {
  "l-carnitine": "rgba(255, 212, 101, 1)",
  curcumin: "rgba(122, 175, 255, 0.8)",
  magnesium: "rgba(146, 250, 231, 0.8)",
  saffron: "rgba(255, 233, 234, 0.8)",
  melatonin: "rgba(255, 255, 255, 0.8)",
};

const SUPPLEMENT_BORDER_COLORS: Record<string, string> = {
  "l-carnitine": "rgba(234, 145, 248, 0.8)",
  curcumin: "rgba(145, 248, 229, 0.8)",
  magnesium: "rgba(252, 251, 99, 0.8)",
  saffron: "rgba(255, 153, 162, 0.8)",
  melatonin: "rgba(80, 227, 229, 0.8)",
};

const SUPPLEMENT_DESCRIPTION: Record<string, string> = {
  "l-carnitine":
    "L-carnitine supplementation appears to be effective in reducing muscle damage, soreness, and oxidative stress following exercise, thereby enhancing overall recovery.",
  curcumin:
    "Curcumin supplementation appears to offer several benefits for exercise recovery, including reduced muscle damage and soreness, anti-inflammatory and antioxidant effects, thereby improving performance recovery.",
  magnesium:
    "Magnesium supplementation aids exercise recovery by reducing muscle soreness, inflammation, and muscle damage. It also improves sleep quality and regulates cortisol levels, supporting tissue repair and energy.",
  saffron:
    "Saffron supplementation can improve exercise recovery by reducing muscle damage and soreness, and enhance sleep quality through increased melatonin production.",
  melatonin:
    "Melatonin improves sleep quality and quantity, which is critical for recovery. Better sleep leads to enhanced physical and cognitive performance the following day.",
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
} as const;

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
} as const;

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
} as const;

// ==================== HELPERS ====================

function normalizeHeader(header: string): string {
  return header
    .trim()
    .replace(/\uFEFF/g, "")
    .replace(/\u00A0/g, "")
    .replace(/\u200B/g, "");
}

function slugify(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function convertValue(
  raw: string,
  integerFields: string[],
  strapiKey: string
): string | number | boolean | null {
  if (raw === "Yes") return true;
  if (raw === "No") return false;
  if (raw.trim() === "") return null;
  if (integerFields.includes(strapiKey)) {
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) ? null : parsed;
  }
  return raw;
}

// ==================== SUPPLEMENTS LOGIC ====================

function mapSupplementRow(csvRow: Record<string, string>) {
  const strapiRow: any = {};

  for (const [csvRawKey, raw] of Object.entries(csvRow)) {
    const csvKey = normalizeHeader(csvRawKey);
    const strapiKey = SUPPLEMENT_SCHEMA[csvKey];

    if (!strapiKey) continue;

    strapiRow[strapiKey] = convertValue(
      raw,
      SUPPLEMENT_INTEGER_FIELDS,
      strapiKey
    );
  }

  strapiRow.slug = slugify(strapiRow.supplement_name as string);
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

function mapResearchPaperRow(csvRow: Record<string, string>) {
  const strapiRow: any = {};

  for (const [csvRawKey, raw] of Object.entries(csvRow)) {
    const csvKey = normalizeHeader(csvRawKey);
    const strapiKey = PAPER_SCHEMA[csvKey];
    if (!strapiKey) continue;
    strapiRow[strapiKey] = convertValue(raw, PAPER_INTEGER_FIELDS, strapiKey);
  }

  const rawTitle = typeof strapiRow.Title === "string" ? strapiRow.Title : "";
  strapiRow.slug = slugify(rawTitle);

  return strapiRow;
}

// ==================== RESULTS LOGIC ====================

function mapResultRow(csvRow: Record<string, string>) {
  const strapiRow: any = {};

  for (const [csvRawKey, raw] of Object.entries(csvRow)) {
    const csvKey = normalizeHeader(csvRawKey);
    const strapiKey = RESULT_SCHEMA[csvKey];
    if (!strapiKey) continue;

    strapiRow[strapiKey] = convertValue(raw, RESULT_INTEGER_FIELDS, strapiKey);
  }

  strapiRow.slug = slugify(strapiRow.title as string);

  return strapiRow;
}

async function processResultRelations(
  strapi: any,
  csvRow: Record<string, string>,
  resultId: number
) {
  try {
    // Extract research paper slugs
    const paperIds: string[] = csvRow["Research Papers"]
      ? (csvRow["Research Papers"] || "").split(",")
      : [];

    const paperResultIds: number[] = [];

    for (const id of paperIds) {
      const papers: any = await strapi.entityService.findMany(
        "api::research-paper.research-paper",
        {
          filters: { id: Number(id) },
          limit: 1,
        }
      );

      if (papers && Array.isArray(papers) && papers[0]?.id) {
        paperResultIds.push(papers[0].id);
      }
    }

    // Extract supplement slugs
    const supplementIds: string[] = csvRow["Supplements"]
      ? (csvRow["Supplements"] || "").split(",")
      : [];

    const supplementResultIds: number[] = [];

    for (const id of supplementIds) {
      const supplements: any = await strapi.entityService.findMany(
        "api::supplement.supplement",
        {
          filters: { id: Number(id) },
          limit: 1,
        }
      );
      if (supplements && Array.isArray(supplements) && supplements[0]?.id) {
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
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

// ==================== TYPE GUARD ====================

function isCsvRecord(obj: unknown): obj is Record<string, string> {
  return (
    typeof obj === "object" &&
    obj !== null &&
    Object.values(obj).every((val) => typeof val === "string")
  );
}

// ==================== CONTROLLER ====================

export default {
  async import(ctx: Context) {
    try {
      const { files, body } = ctx.request;
      const collection = body.collection || "supplements";

      if (!files || !files.file) {
        return ctx.badRequest("No file uploaded");
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      const fileContent = require("fs").readFileSync(file.filepath, "utf8");

      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      }) as unknown[];

      if (records.length === 0) {
        return ctx.badRequest("CSV file is empty");
      }

      let success = 0;
      let failed = 0;

      const errors: any[] = [];

      // Route to correct collection
      if (collection === "supplements") {
        const firstRecord = records[0];
        if (!isCsvRecord(firstRecord)) {
          return ctx.badRequest("Invalid CSV format");
        }

        for (const record of records) {
          if (!isCsvRecord(record)) continue;

          try {
            const strapiRow = mapSupplementRow(record);
            const existing: any = await strapi.entityService.findMany(
              "api::supplement.supplement",
              {
                filters: { slug: strapiRow.slug },
                limit: 1,
              }
            );

            if (existing && Array.isArray(existing) && existing.length > 0) {
              errors.push({
                row: record.results || "Unknown",
                error: `Collection for slug: {${strapiRow.slug}} is exist in the database`,
              });
              failed++;
              continue;
            } else {
              await strapi.entityService.create("api::supplement.supplement", {
                data: strapiRow,
              });
            }
            success++;
          } catch (err) {
            failed++;
            errors.push({
              row: record.supplement_name || "Unknown",
              error: (err as Error).message,
            });
          }
        }
      } else if (collection === "research-papers") {
        const firstRecord = records[0];
        if (!isCsvRecord(firstRecord)) {
          return ctx.badRequest("Invalid CSV format");
        }

        for (const record of records) {
          if (!isCsvRecord(record)) continue;

          try {
            const strapiRow = mapResearchPaperRow(record);
            const existing: any = await strapi.entityService.findMany(
              "api::research-paper.research-paper",
              {
                filters: { slug: strapiRow.slug },
                limit: 1,
              }
            );

            if (existing && Array.isArray(existing) && existing.length > 0) {
              errors.push({
                row: record.results || "Unknown",
                error: `Collection for slug: {${strapiRow.slug}} is exist in the database`,
              });
              failed++;
              continue;
            } else {
              await strapi.entityService.create(
                "api::research-paper.research-paper",
                { data: strapiRow }
              );
            }
            success++;
          } catch (err) {
            failed++;
            errors.push({
              row: record.Title || "Unknown",
              error: (err as Error).message,
            });
          }
        }
      } else if (collection === "results") {
        const firstRecord = records[0];
        if (!isCsvRecord(firstRecord)) {
          return ctx.badRequest("Invalid CSV format");
        }

        const insertedIds: Record<string, number> = {};

        // First pass: insert main data
        for (const record of records) {
          if (!isCsvRecord(record)) continue;

          try {
            const strapiRow = mapResultRow(record);
            const existing: any = await strapi.entityService.findMany(
              "api::result.result",
              {
                filters: { slug: strapiRow.slug },
                limit: 1,
              }
            );

            let resultId;
            if (existing && Array.isArray(existing) && existing.length > 0) {
              errors.push({
                row: record.results || "Unknown",
                error: `Collection for slug: {${strapiRow.slug}} is exist in the database`,
              });
              failed++;
              continue;
            } else {
              const created = await strapi.entityService.create(
                "api::result.result",
                { data: strapiRow }
              );
              resultId = created.id;
            }
            insertedIds[strapiRow.slug] = resultId;
            success++;
          } catch (err) {
            failed++;
            errors.push({
              row: record.results || "Unknown",
              error: (err as Error).message,
            });
          }
        }

        // Second pass: update relations
        for (const record of records) {
          if (!isCsvRecord(record)) continue;

          const strapiRow = mapResultRow(record);
          const resultId = insertedIds[strapiRow.slug];
          if (resultId) {
            await processResultRelations(strapi, record, resultId);
          }
        }
      } else {
        return ctx.badRequest(`Unknown collection: ${collection}`);
      }

      return ctx.send({
        success: true,
        message: "Import completed",
        stats: { total: records.length, success, failed },
        errors: errors.length > 0 ? errors : undefined,
      });
    } catch (error) {
      return ctx.internalServerError(
        "Import failed: " + (error as Error).message
      );
    }
  },

  async export(ctx: Context) {
    try {
      const { collection } = ctx.query;

      let data: any;
      let filename: string;

      if (collection === "research-papers") {
        data = await strapi.entityService.findMany(
          "api::research-paper.research-paper",
          {
            fields: "*",
            sort: { Title: "asc" },
          }
        );
        filename = `research-papers-export-${Date.now()}.csv`;
      } else if (collection === "results") {
        data = await strapi.entityService.findMany("api::result.result", {
          fields: "*",
          sort: { slug: "asc" },
        });
        filename = `results-export-${Date.now()}.csv`;
      } else {
        data = await strapi.entityService.findMany(
          "api::supplement.supplement",
          {
            fields: "*",
            sort: { supplement_name: "asc" },
          }
        );
        filename = `supplements-export-${Date.now()}.csv`;
      }

      const dataArray = Array.isArray(data) ? data : [data];

      if (!dataArray || dataArray.length === 0) {
        return ctx.badRequest("No data found to export");
      }

      const csvData = stringify(dataArray, {
        header: true,
        columns: Object.keys(dataArray[0]).filter(
          (key) =>
            key !== "id" &&
            key !== "createdAt" &&
            key !== "updatedAt" &&
            key !== "publishedAt"
        ),
      });

      ctx.set("Content-Type", "text/csv");
      ctx.set("Content-Disposition", `attachment; filename=${filename}`);

      return ctx.send(csvData);
    } catch (error) {
      return ctx.internalServerError(
        "Export failed: " + (error as Error).message
      );
    }
  },

  async collections(ctx: Context) {
    return ctx.send({
      collections: [
        { id: "supplements", label: "Supplements" },
        { id: "research-papers", label: "Research Papers" },
        { id: "results", label: "Results" },
      ],
    });
  },
};

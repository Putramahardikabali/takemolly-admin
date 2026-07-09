import type { Context } from "koa";
import { factories } from "@strapi/strapi";
import { normalizeText } from "../../../helpers";

function hasMatchingResult(paper: any) {
  return [paper.Results, paper.RelatedToResults1, paper.RelatedToResults2].some(
    (value) => normalizeText(value).length > 0,
  );
}

export default factories.createCoreController(
  "api::supplement.supplement",
  ({ strapi }) => ({
    // =====================================================
    // GET /api/supplements
    // =====================================================
    async find(ctx: Context) {
      const query = ctx.query;

      const supplements = await strapi
        .documents("api::supplement.supplement")
        .findMany(query);

      const results = await strapi.documents("api::result.result").findMany({
        limit: 100000,
        populate: {
          researchPapers: {
            fields: ["id", "Supplement"],
          },
          supplements: {
            fields: ["slug"],
          },
        },
      });

      const filterKeys = [
        "cortisol",
        "inflammation",
        "muscle_damage",
        "muscle_soreness",
        "oxidative_stress",
        "pain",
        "sleep_quality",
      ] as const;

      type FilterKey = (typeof filterKeys)[number];

      const filterFieldMap: Record<FilterKey, string> = {
        cortisol: "cortisolFilter",
        inflammation: "inflammationFilter",
        muscle_damage: "muscleDamageFilter",
        muscle_soreness: "muscleSorenessFilter",
        oxidative_stress: "oxidativeStressFilter",
        pain: "painFilter",
        sleep_quality: "sleepQualityFilter",
      };

      const data = supplements.map((supplement) => {
        const supplementSlug = supplement.slug ?? "";

        const filtered = results.filter((result) =>
          (result.supplements as { slug: string }[])?.some(
            (s) => s.slug === supplementSlug,
          ),
        );

        const ids = Object.fromEntries(
          filterKeys.map((key) => [key, new Set<number>()]),
        ) as Record<FilterKey, Set<number>>;

        for (const result of filtered) {
          for (const key of filterKeys) {
            if (result[filterFieldMap[key]]) {
              for (const paper of (result.researchPapers as {
                id: number;
                Supplement: string;
              }[]) ?? []) {
                if (supplementSlug === "magnesium" && key === "inflammation") {
                  console.log(paper);
                }
                if (
                  paper.id &&
                  (paper.Supplement ?? "")
                    .toLowerCase()
                    .includes((supplement.supplement_name || "").toLowerCase())
                )
                  ids[key].add(paper.id);
              }
            }
          }
        }

        return {
          ...supplement,
          ...Object.fromEntries(
            filterKeys.map((key) => [`studies_count_${key}`, ids[key].size]),
          ),
        };
      });

      return ctx.send({ data });
    },

    // =====================================================
    // GET /api/supplements/:id  (documentId)
    // =====================================================
    async findOne(ctx: Context) {
      const { id } = ctx.params;
      const query = ctx.query;

      const entity = await strapi
        .documents("api::supplement.supplement")
        .findOne({
          documentId: id,
          ...query,
        });

      if (!entity) {
        return ctx.notFound("Supplement not found");
      }

      return ctx.send({ data: entity });
    },

    // =====================================================
    // GET /api/supplements/slug/:id
    // =====================================================
    async findBySlug(ctx: Context) {
      const { id } = ctx.params;
      const query = ctx.query;

      if (!id) {
        return ctx.badRequest("Slug is required");
      }

      const results = await strapi
        .documents("api::supplement.supplement")
        .findMany({
          filters: { slug: { $eq: id } },
          limit: 1,
          ...query,
        });

      if (!results || results.length === 0) {
        return ctx.notFound(`Supplement with slug "${id}" not found`);
      }

      return ctx.send({
        data: results[0],
      });
    },

    // =====================================================
    // GET /api/supplements/ours
    // =====================================================
    async findOurs(ctx: Context) {
      const query = ctx.query;

      const results = await strapi
        .documents("api::supplement.supplement")
        .findMany({
          filters: {
            is_our_supplement: { $eq: true },
          },
          ...query,
        });

      return ctx.send({
        data: results,
      });
    },
  }),
);

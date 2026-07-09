"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
const helpers_1 = require("../../../helpers");
function hasMatchingResult(paper) {
    return [paper.Results, paper.RelatedToResults1, paper.RelatedToResults2].some((value) => (0, helpers_1.normalizeText)(value).length > 0);
}
exports.default = strapi_1.factories.createCoreController("api::supplement.supplement", ({ strapi }) => ({
    // =====================================================
    // GET /api/supplements
    // =====================================================
    async find(ctx) {
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
        ];
        const filterFieldMap = {
            cortisol: "cortisolFilter",
            inflammation: "inflammationFilter",
            muscle_damage: "muscleDamageFilter",
            muscle_soreness: "muscleSorenessFilter",
            oxidative_stress: "oxidativeStressFilter",
            pain: "painFilter",
            sleep_quality: "sleepQualityFilter",
        };
        const data = supplements.map((supplement) => {
            var _a, _b, _c;
            const supplementSlug = (_a = supplement.slug) !== null && _a !== void 0 ? _a : "";
            const filtered = results.filter((result) => {
                var _a;
                return (_a = result.supplements) === null || _a === void 0 ? void 0 : _a.some((s) => s.slug === supplementSlug);
            });
            const ids = Object.fromEntries(filterKeys.map((key) => [key, new Set()]));
            for (const result of filtered) {
                for (const key of filterKeys) {
                    if (result[filterFieldMap[key]]) {
                        for (const paper of (_b = result.researchPapers) !== null && _b !== void 0 ? _b : []) {
                            if (supplementSlug === "magnesium" && key === "inflammation") {
                                console.log(paper);
                            }
                            if (paper.id &&
                                ((_c = paper.Supplement) !== null && _c !== void 0 ? _c : "")
                                    .toLowerCase()
                                    .includes((supplement.supplement_name || "").toLowerCase()))
                                ids[key].add(paper.id);
                        }
                    }
                }
            }
            return {
                ...supplement,
                ...Object.fromEntries(filterKeys.map((key) => [`studies_count_${key}`, ids[key].size])),
            };
        });
        return ctx.send({ data });
    },
    // =====================================================
    // GET /api/supplements/:id  (documentId)
    // =====================================================
    async findOne(ctx) {
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
    async findBySlug(ctx) {
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
    async findOurs(ctx) {
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
}));

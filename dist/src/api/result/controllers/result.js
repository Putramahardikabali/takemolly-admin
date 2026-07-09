"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * List biomarker boolean fields
 */
const BIOMARKER_FILTERS = [
    "oxidativeStressFilter",
    "muscleDamageFilter",
    "muscleSorenessFilter",
    "inflammationFilter",
    "painFilter",
    "sleepQualityFilter",
    "cortisolFilter",
];
/**
 * Mapping slug → field boolean
 */
const BIOMARKER_SLUG_MAP = {
    "oxidative-stress": "oxidativeStressFilter",
    "muscle-damage": "muscleDamageFilter",
    "muscle-soreness": "muscleSorenessFilter",
    inflammation: "inflammationFilter",
    pain: "painFilter",
    "sleep-quality": "sleepQualityFilter",
    cortisol: "cortisolFilter",
};
exports.default = {
    async filter(ctx) {
        const { query } = ctx;
        /**
         * 1. Ambil supplement IDs
         */
        let supplementSlugs = [];
        if (typeof query.supplements === "string") {
            supplementSlugs = query.supplements
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
        }
        else if (typeof query.supplement === "string") {
            supplementSlugs = [query.supplement];
        }
        /**
         * 2. Ambil biomarker filters dari query
         */
        const selectedFilters = BIOMARKER_FILTERS.filter((filterName) => {
            const value = query[filterName];
            return value === "true" || value === "1" || value === "yes";
        });
        /**
         * 3. Infer dari biomarker slug
         */
        if (selectedFilters.length === 0 && typeof query.biomarker === "string") {
            const inferred = BIOMARKER_SLUG_MAP[query.biomarker];
            if (inferred)
                selectedFilters.push(inferred);
        }
        /**
         * 4. Pagination & sort
         */
        const page = query.page && !Number.isNaN(Number(query.page)) ? Number(query.page) : 1;
        const pageSize = query.limit && !Number.isNaN(Number(query.limit))
            ? Number(query.limit)
            : 10;
        const sort = typeof query.sort === "string" && query.sort.length > 0
            ? [query.sort]
            : ["createdAt:desc"];
        /**
         * 5. No filter → default query
         */
        if (selectedFilters.length === 0 || supplementSlugs.length === 0) {
            return await strapi.entityService.findMany("api::result.result", {
                pagination: { page, pageSize },
                sort,
                populate: "*",
            });
        }
        /**
         * 6. Bangun OR + AND filter
         */
        const filters = {
            $or: selectedFilters.map((filterName) => ({
                $and: [
                    { [filterName]: true },
                    { supplements: { slug: { $in: supplementSlugs } } },
                ],
            })),
        };
        console.log(JSON.stringify(filters));
        /**
         * 7. Query Strapi
         */
        return await strapi.entityService.findMany("api::result.result", {
            filters,
            pagination: { page, pageSize },
            sort,
            populate: "*",
        });
    },
};

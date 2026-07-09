"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController("api::result-page.result-page", ({ strapi }) => ({
    async find(ctx) {
        const result = await strapi
            .documents("api::result-page.result-page")
            .findFirst({
            ...ctx.query,
            populate: {
                seo: { populate: "*" },
                sections: {
                    on: {
                        "sections.page-header": { populate: "*" },
                        "sections.result-transparency": { populate: "*" },
                    },
                },
            },
        });
        if (!result) {
            return ctx.notFound("Result page content not found");
        }
        const sanitizedEntity = await this.sanitizeOutput(result, ctx);
        return this.transformResponse(sanitizedEntity);
    },
}));

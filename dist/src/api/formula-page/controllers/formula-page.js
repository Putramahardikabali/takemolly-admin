"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController("api::formula-page.formula-page", ({ strapi }) => ({
    async find(ctx) {
        const result = await strapi
            .documents("api::formula-page.formula-page")
            .findFirst({
            ...ctx.query,
            populate: {
                seo: { populate: "*" },
                sections: {
                    on: {
                        "sections.page-header": { populate: "*" },
                    },
                },
            },
        });
        if (!result) {
            return ctx.notFound("Formula page content not found");
        }
        const sanitizedEntity = await this.sanitizeOutput(result, ctx);
        return this.transformResponse(sanitizedEntity);
    },
}));

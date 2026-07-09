"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController("api::how-we-did-it-page.how-we-did-it-page", ({ strapi }) => ({
    async find(ctx) {
        // 1. Fetch the document
        const result = await strapi
            .documents("api::how-we-did-it-page.how-we-did-it-page")
            .findFirst({
            ...ctx.query, // This allows filters like ?locale=en
            // Note: navbar_cta_override and navbar_cta_link are included AUTOMATICALLY
            populate: {
                seo: { populate: "*" },
                sections: {
                    on: {
                        "sections.how-we-did-it-video": { populate: { videos: { populate: "*" } }, },
                    },
                },
            },
        });
        if (!result) {
            return ctx.notFound("How we did it page content not found");
        }
        // 2. Sanitize and transform the response
        const sanitizedEntity = await this.sanitizeOutput(result, ctx);
        return this.transformResponse(sanitizedEntity);
    },
}));

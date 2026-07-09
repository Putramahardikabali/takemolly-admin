"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController("api::about-page.about-page", ({ strapi }) => ({
    async find(ctx) {
        const result = await strapi
            .documents("api::about-page.about-page")
            .findFirst({
            ...ctx.query,
            populate: {
                seo: { populate: "*" },
                sections: {
                    on: {
                        "sections.about-hero": { populate: "*" },
                        "sections.about-led-by": {
                            populate: { experts: { populate: "*" } },
                        },
                        "sections.about-government-approved": { populate: "*" },
                        "sections.about-passion-profit": { populate: "*" },
                        "sections.about-contact-help": { populate: "*" },
                    },
                },
            },
        });
        if (!result) {
            return ctx.notFound("About page content not found");
        }
        const sanitizedEntity = await this.sanitizeOutput(result, ctx);
        return this.transformResponse(sanitizedEntity);
    },
}));

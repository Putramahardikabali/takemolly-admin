"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController("api::social-proof-page.social-proof-page", ({ strapi }) => ({
    async find(ctx) {
        const result = await strapi
            .documents("api::social-proof-page.social-proof-page")
            .findFirst({
            ...ctx.query,
            populate: {
                seo: { populate: "*" },
                sections: {
                    on: {
                        "sections.social-proof-gallery": {
                            populate: { items: { populate: "*" } },
                        },
                    },
                },
            },
        });
        if (!result) {
            return ctx.notFound("Social proof page content not found");
        }
        const sanitizedEntity = await this.sanitizeOutput(result, ctx);
        return this.transformResponse(sanitizedEntity);
    },
}));

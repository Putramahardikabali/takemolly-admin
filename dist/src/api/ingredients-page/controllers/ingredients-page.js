"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController("api::ingredients-page.ingredients-page", ({ strapi }) => ({
    async find(ctx) {
        const result = await strapi
            .documents("api::ingredients-page.ingredients-page")
            .findFirst({
            ...ctx.query,
            populate: {
                seo: { populate: "*" },
                sections: {
                    on: {
                        "sections.ingredients-list": {
                            populate: { items: { populate: "*" } },
                        },
                    },
                },
            },
        });
        if (!result) {
            return ctx.notFound("Ingredients page content not found");
        }
        const sanitizedEntity = await this.sanitizeOutput(result, ctx);
        return this.transformResponse(sanitizedEntity);
    },
}));

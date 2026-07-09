"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController("api::stockist-page.stockist-page", ({ strapi }) => ({
    async find(ctx) {
        const result = await strapi
            .documents("api::stockist-page.stockist-page")
            .findFirst({
            ...ctx.query,
            populate: {
                seo: { populate: "*" },
                sections: {
                    on: {
                        "sections.stockist-locator": {
                            populate: {
                                offline_stores: { populate: "*" },
                                online_stores: { populate: "*" },
                            },
                        },
                    },
                },
            },
        });
        if (!result) {
            return ctx.notFound("Stockist page content not found");
        }
        const sanitizedEntity = await this.sanitizeOutput(result, ctx);
        return this.transformResponse(sanitizedEntity);
    },
}));

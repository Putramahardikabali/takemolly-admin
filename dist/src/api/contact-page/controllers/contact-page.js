"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController("api::contact-page.contact-page", ({ strapi }) => ({
    async find(ctx) {
        const result = await strapi
            .documents("api::contact-page.contact-page")
            .findFirst({
            ...ctx.query,
            populate: {
                seo: { populate: "*" },
                sections: {
                    on: {
                        "sections.contact-form": { populate: "*" },
                    },
                },
            },
        });
        if (!result) {
            return ctx.notFound("Contact page content not found");
        }
        const sanitizedEntity = await this.sanitizeOutput(result, ctx);
        return this.transformResponse(sanitizedEntity);
    },
}));

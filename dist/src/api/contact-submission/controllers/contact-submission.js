"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController("api::contact-submission.contact-submission", ({ strapi }) => ({
    async create(ctx) {
        const { first_name, email, message } = ctx.request.body;
        if (!first_name || !email || !message) {
            return ctx.badRequest("first_name, email, and message are required");
        }
        const entry = await strapi
            .documents("api::contact-submission.contact-submission")
            .create({
            data: { first_name, email, message },
        });
        const sanitizedEntity = await this.sanitizeOutput(entry, ctx);
        return this.transformResponse(sanitizedEntity);
    },
    async find(ctx) {
        const result = await strapi
            .documents("api::contact-submission.contact-submission")
            .findMany(ctx.query);
        const sanitizedResults = await this.sanitizeOutput(result, ctx);
        return ctx.send({ data: sanitizedResults });
    },
}));

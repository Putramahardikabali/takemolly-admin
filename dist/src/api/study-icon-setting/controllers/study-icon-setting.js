"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController("api::study-icon-setting.study-icon-setting", ({ strapi }) => ({
    async find(ctx) {
        const result = await strapi
            .documents("api::study-icon-setting.study-icon-setting")
            .findFirst({
            ...ctx.query,
            populate: {
                check_evidence_icon: true,
                star_evidence_icon: true,
                cap_evidence_icon: true,
                caution_icon: true,
            },
        });
        if (!result) {
            return ctx.notFound("Study icon settings not found");
        }
        const sanitizedEntity = await this.sanitizeOutput(result, ctx);
        return this.transformResponse(sanitizedEntity);
    },
}));

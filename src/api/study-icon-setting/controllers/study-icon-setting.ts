import type { Context } from "koa";
import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::study-icon-setting.study-icon-setting",
  ({ strapi }) => ({
    async find(ctx: Context) {
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
  }),
);

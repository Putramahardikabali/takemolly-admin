import type { Context } from "koa";
import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::about-page.about-page",
  ({ strapi }) => ({
    async find(ctx: Context) {
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
  }),
);

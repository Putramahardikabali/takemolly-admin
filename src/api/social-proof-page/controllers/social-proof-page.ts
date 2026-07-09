import type { Context } from "koa";
import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::social-proof-page.social-proof-page",
  ({ strapi }) => ({
    async find(ctx: Context) {
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
  }),
);

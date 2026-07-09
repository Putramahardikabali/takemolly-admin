import type { Context } from "koa";
import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::stockist-page.stockist-page",
  ({ strapi }) => ({
    async find(ctx: Context) {
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
  }),
);

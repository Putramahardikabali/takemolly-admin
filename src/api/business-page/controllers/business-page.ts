import type { Context } from "koa";
import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::business-page.business-page",
  ({ strapi }) => ({
    async find(ctx: Context) {
      // 1. Fetch the document
      const result = await strapi
        .documents("api::business-page.business-page")
        .findFirst({
          ...ctx.query, // This allows filters like ?locale=en
          // Note: navbar_cta_override and navbar_cta_link are included AUTOMATICALLY
          populate: {
            seo: { populate: "*" },
            sections: {
              on: {
                "sections.business-hero": { populate: "*" },
                "sections.business-media-marquee": { populate: "*" },
                "sections.business-founder": { populate: "*" },
                "sections.business-how-it-works": {
                  populate: { steps: { populate: "*" } },
                },
                "sections.business-product-pricing": {
                  populate: { products: { populate: "*" } },
                },
                "sections.business-benefits": {
                  populate: { benefit_items: { populate: "*" } },
                },
                "sections.business-testimonials": {
                  populate: { slides: { populate: "*" } },
                },
                "sections.business-faq": {
                  populate: { items: { populate: "*" } },
                },
              },
            },
          },
        });

      if (!result) {
        return ctx.notFound("Business page content not found");
      }

      // 2. Sanitize and transform the response
      const sanitizedEntity = await this.sanitizeOutput(result, ctx);
      return this.transformResponse(sanitizedEntity);
    },
  }),
);

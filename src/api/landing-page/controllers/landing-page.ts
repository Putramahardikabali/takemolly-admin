import type { Context } from "koa";
import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::landing-page.landing-page",
  ({ strapi }) => ({
    async find(ctx: Context) {
      const result = await strapi
        .documents("api::landing-page.landing-page")
        .findFirst({
          ...ctx.query,
          populate: {
            seo: { populate: "*" },
            sections: {
              on: {
                "sections.hero": { populate: "*" },
                "sections.biomarkers": {
                  populate: "*",
                },
                // Try simplifying this to "*" first
                "sections.formula": {
                  populate: "*",
                },
                "sections.founder-timeline": {
                  populate: { events: { populate: "*" } },
                },
                "sections.how-it-works": {
                  populate: {
                    // Populate steps and sachet_image
                    steps: { populate: "*" },
                    sachet_image: { populate: "*" },
                  },
                },
                "sections.how-we-did-it": {
                  populate: { stats: { populate: "*" } },
                },
                "sections.results-database": {
                  populate:  "*",
                },
                "sections.athletes": {
                  populate: { slides: { populate: "*" } },
                },
                "sections.why-better": {
                  populate: { features: { populate: "*" } },
                },
              },
            },
          },
        });

      if (!result) {
        return ctx.notFound("Landing page content not found");
      }

      return ctx.send({ data: result });
    },
  }),
);

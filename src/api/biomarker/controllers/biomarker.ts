import type { Context } from "koa";
import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::biomarker.biomarker",
  ({ strapi }) => ({
    // =====================================================
    // GET /api/biomarkers
    // =====================================================
    async find(ctx: Context) {
      const query = ctx.query;

      const result = await strapi
        .documents("api::biomarker.biomarker")
        .findMany({
          sort: { order_column: "asc" },
          ...query,
        });

      return ctx.send({ data: result });
    },

    // =====================================================
    // GET /api/biomarkers/:id  (documentId)
    // =====================================================
    async findOne(ctx: Context) {
      const { id } = ctx.params;
      const query = ctx.query;

      const entity = await strapi
        .documents("api::biomarker.biomarker")
        .findOne({
          documentId: id,
          ...query,
        });

      if (!entity) {
        return ctx.notFound("Biomarker not found");
      }

      return ctx.send({ data: entity });
    },

    // =====================================================
    // GET /api/biomarkers/slug/:id
    // =====================================================
    async findBySlug(ctx: Context) {
      const { id } = ctx.params;
      const query = ctx.query;

      if (!id) {
        return ctx.badRequest("Slug is required");
      }

      const results = await strapi
        .documents("api::biomarker.biomarker")
        .findMany({
          filters: { slug: { $eq: id } },
          limit: 1,
          ...query,
        });

      if (!results || results.length === 0) {
        return ctx.notFound(`Biomarker with slug "${id}" not found`);
      }

      return ctx.send({ data: results[0] });
    },
  }),
);

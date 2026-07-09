import type { Context } from "koa";
import { factories } from "@strapi/strapi";
import { marked } from "marked";

const estimateReadingTime = (html: string) => {
  if (!html) return 0;
  const text = html.replace(/<[^>]+>/g, "");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

const defaultPopulate = {
  author: {
    fields: ["id", "username"],
  },
  categories: {
    fields: ["id", "name", "slug"],
  },
};

const renderHtml = (content: string) => {
  if (!content) return "";
  return marked.parse(content);
};

export default factories.createCoreController(
  "api::blog.blog",
  ({ strapi }) => ({
    // =====================================================
    // GET /api/blogs
    // =====================================================
    async find(ctx: Context) {
      const query = ctx.query;

      const result = await strapi.documents("api::blog.blog").findMany({
        ...query,
        populate: defaultPopulate,
      });

      const data = result.map((item) => ({
        ...item,
        readingTime: estimateReadingTime(item.content),
        content: renderHtml(item.content),
      }));

      return ctx.send({ data });
    },

    // =====================================================
    // GET /api/blogs/:id
    // =====================================================
    async findOne(ctx: Context) {
      const { id } = ctx.params;
      const query = ctx.query;

      const entity = await strapi.documents("api::blog.blog").findOne({
        documentId: id,
        ...query,
        populate: defaultPopulate,
      });

      if (!entity) {
        return ctx.notFound("Blog not found");
      }

      return ctx.send({
        data: {
          ...entity,
          readingTime: estimateReadingTime(entity.content),
          content: renderHtml(entity.content),
        },
      });
    },

    // =====================================================
    // GET /api/blogs/slug/:slug
    // =====================================================
    async findBySlug(ctx: Context) {
      const { id } = ctx.params;
      const query = ctx.query;

      const results = await strapi.documents("api::blog.blog").findMany({
        filters: { slug: { $eq: id } },
        limit: 1,
        populate: defaultPopulate,
        ...query,
      });

      if (!results?.length) {
        return ctx.notFound(`Blog with slug "${id}" not found`);
      }

      const blog = results[0];

      return ctx.send({
        data: {
          ...blog,
          readingTime: estimateReadingTime(blog.content),
          content: renderHtml(blog.content),
        },
      });
    },
  })
);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
const marked_1 = require("marked");
const estimateReadingTime = (html) => {
    if (!html)
        return 0;
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
const renderHtml = (content) => {
    if (!content)
        return "";
    return marked_1.marked.parse(content);
};
exports.default = strapi_1.factories.createCoreController("api::blog.blog", ({ strapi }) => ({
    // =====================================================
    // GET /api/blogs
    // =====================================================
    async find(ctx) {
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
    async findOne(ctx) {
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
    async findBySlug(ctx) {
        const { id } = ctx.params;
        const query = ctx.query;
        const results = await strapi.documents("api::blog.blog").findMany({
            filters: { slug: { $eq: id } },
            limit: 1,
            populate: defaultPopulate,
            ...query,
        });
        if (!(results === null || results === void 0 ? void 0 : results.length)) {
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
}));

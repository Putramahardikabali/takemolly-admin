import type { Context } from "koa";
import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::contact-submission.contact-submission",
  ({ strapi }) => ({
    async create(ctx: Context) {
      const { first_name, email, message } = ctx.request.body as {
        first_name?: string;
        email?: string;
        message?: string;
      };

      if (!first_name || !email || !message) {
        return ctx.badRequest("first_name, email, and message are required");
      }

      const entry = await strapi
        .documents("api::contact-submission.contact-submission")
        .create({
          data: { first_name, email, message },
        });

      const sanitizedEntity = await this.sanitizeOutput(entry, ctx);
      return this.transformResponse(sanitizedEntity);
    },

    async find(ctx: Context) {
      const result = await strapi
        .documents("api::contact-submission.contact-submission")
        .findMany(ctx.query);

      const sanitizedResults = await this.sanitizeOutput(result, ctx);
      return ctx.send({ data: sanitizedResults });
    },
  }),
);

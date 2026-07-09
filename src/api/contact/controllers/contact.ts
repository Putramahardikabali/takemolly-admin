import type { Context } from "koa";
import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::contact.contact",
  ({ strapi }) => ({
    async find(ctx: Context) {
      // 1. Sanitize the incoming query (removes invalid params and respects permissions)
      const sanitizedQueryParams = await this.sanitizeQuery(ctx);

      // 2. Fetch the document
      // We don't need 'populate' for email or phone strings; they come back automatically.
      const result = await strapi
        .documents("api::contact.contact")
        .findFirst(sanitizedQueryParams);

      if (!result) {
        return ctx.notFound("Contact content not found");
      }

      // 3. Sanitize the output (removes private fields like passwords or internal IDs)
      const sanitizedResult = await this.sanitizeOutput(result, ctx);

      // 4. Transform the response to follow the standard { data: { ... } } format
      return this.transformResponse(sanitizedResult);
    },
  }),
);

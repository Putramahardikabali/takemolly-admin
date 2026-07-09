export default () => async (ctx, next) => {
  console.log("➡️ HIT:", ctx.method, ctx.url);
  await next();
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => async (ctx, next) => {
    console.log("➡️ HIT:", ctx.method, ctx.url);
    await next();
};

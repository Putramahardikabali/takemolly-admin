"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: "GET",
            path: "/stockist-page",
            handler: "stockist-page.find",
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: "GET",
            path: "/social-proof-page",
            handler: "social-proof-page.find",
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};

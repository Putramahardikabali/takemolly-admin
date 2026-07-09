"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: "GET",
            path: "/landing-page",
            handler: "landing-page.find",
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};

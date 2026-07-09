"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: "GET",
            path: "/about-page",
            handler: "about-page.find",
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: "GET",
            path: "/contact-page",
            handler: "contact-page.find",
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: "GET",
            path: "/business-page",
            handler: "business-page.find",
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};

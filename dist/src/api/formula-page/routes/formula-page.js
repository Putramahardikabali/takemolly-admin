"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: "GET",
            path: "/formula-page",
            handler: "formula-page.find",
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};

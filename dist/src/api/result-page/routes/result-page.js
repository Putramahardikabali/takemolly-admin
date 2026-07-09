"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: "GET",
            path: "/result-page",
            handler: "result-page.find",
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};

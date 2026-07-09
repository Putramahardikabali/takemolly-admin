"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: "GET",
            path: "/ingredients-page",
            handler: "ingredients-page.find",
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: "GET",
            path: "/blogs",
            handler: "blog.find",
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: "GET",
            path: "/blogs/:id",
            handler: "blog.findOne",
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: "GET",
            path: "/blogs/slug/:id",
            handler: "blog.findBySlug",
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};

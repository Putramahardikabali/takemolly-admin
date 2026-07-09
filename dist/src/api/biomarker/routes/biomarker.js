"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: "GET",
            path: "/biomarkers",
            handler: "biomarker.find",
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: "GET",
            path: "/biomarkers/slug/:id",
            handler: "biomarker.findBySlug",
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: "GET",
            path: "/biomarkers/:id",
            handler: "biomarker.findOne",
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};

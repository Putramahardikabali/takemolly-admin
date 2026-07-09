"use strict";
// src/api/supplement/routes/import-export.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: "POST",
            path: "/import-export/import",
            handler: "import-export.import",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: "GET",
            path: "/import-export/export",
            handler: "import-export.export",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: "GET",
            path: "/import-export/collections",
            handler: "import-export.collections",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ],
};

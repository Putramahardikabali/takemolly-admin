"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: "POST",
            path: "/contact-submissions",
            handler: "contact-submission.create",
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: "GET",
            path: "/contact-submissions",
            handler: "contact-submission.find",
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};

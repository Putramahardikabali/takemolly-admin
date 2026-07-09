export default {
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

export default {
  routes: [
    {
      method: "GET",
      path: "/stockist-page",
      handler: "stockist-page.find",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

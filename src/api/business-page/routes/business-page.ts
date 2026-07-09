export default {
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

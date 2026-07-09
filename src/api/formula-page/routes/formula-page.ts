export default {
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

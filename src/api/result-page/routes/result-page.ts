export default {
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

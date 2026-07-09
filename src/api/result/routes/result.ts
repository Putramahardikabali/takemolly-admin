module.exports = {
  routes: [
    {
      method: "GET",
      path: "/results/filter",
      handler: "result.filter",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

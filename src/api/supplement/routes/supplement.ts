export default {
  routes: [
    {
      method: "GET",
      path: "/supplements",
      handler: "supplement.find",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/supplements/ours",
      handler: "supplement.findOurs",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/supplements/:id",
      handler: "supplement.findOne",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/supplements/slug/:id",
      handler: "supplement.findBySlug",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

export default {
  routes: [
    {
      method: "GET",
      path: "/about-page",
      handler: "about-page.find",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

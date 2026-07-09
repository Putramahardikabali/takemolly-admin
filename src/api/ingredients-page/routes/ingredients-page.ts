export default {
  routes: [
    {
      method: "GET",
      path: "/ingredients-page",
      handler: "ingredients-page.find",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

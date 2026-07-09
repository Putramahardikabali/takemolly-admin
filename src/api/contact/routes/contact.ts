export default {
  routes: [
    {
      method: "GET",
      path: "/contact",
      handler: "contact.find",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

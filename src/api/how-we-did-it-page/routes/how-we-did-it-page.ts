export default {
  routes: [
    {
      method: "GET",
      path: "/how-we-did-it-page",
      handler: "how-we-did-it-page.find",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

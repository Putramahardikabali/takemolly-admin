export default {
  routes: [
    {
      method: "GET",
      path: "/study-icon-setting",
      handler: "study-icon-setting.find",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};

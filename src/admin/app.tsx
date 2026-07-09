import type { StrapiApp } from "@strapi/strapi/admin";

export default {
  config: {
    locales: ["en"],
    head: {
      title: "Molly Admin Panel",
    },
    translations: {
      en: {
        "Auth.form.welcome.title": "Welcome to Molly Admin!",
        "Auth.form.welcome.subtitle": "Sign in to continue",
      },
    },
  },
  bootstrap(app: StrapiApp) {
    console.log(app);
    app.addSettingsLink("global", {
      intlLabel: {
        id: "import-export.settings.title",
        defaultMessage: "Import/Export",
      },
      id: "import-export",
      to: "/settings/import-export",
      Component: async () => {
        const component = await import("./components/ImportExport");
        return component;
      },
      permissions: [],
    });
  },
};

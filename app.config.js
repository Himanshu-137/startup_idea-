export default {
  expo: {
    name: "Startup Ideas",
    slug: "startup-ideas-app",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    splash: {
      resizeMode: "contain",
      backgroundColor: "#6366f1"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourcompany.startupideas"
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#6366f1"
      },
      package: "com.yourcompany.startupideas"
    },
    web: {
      bundler: "metro"
    },

    // ✅ Correct placement of extra
    extra: {
      eas: {
        projectId: "6d0290ec-0d8f-449c-961c-1cbed0083437"
      }
    }
  }
};

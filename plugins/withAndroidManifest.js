const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withAndroidManifestFix(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults.manifest;

    // Ensure we have the application object
    if (!androidManifest.application) {
      androidManifest.application = [];
    }

    // If there's no application array or it's empty, create it
    if (!androidManifest.application.length) {
      androidManifest.application.push({ $: {} });
    }

    // Get the application object
    const application = androidManifest.application[0];

    // Ensure we have the $ object
    if (!application.$) {
      application.$ = {};
    }

    // Add the required attributes
    application.$["xmlns:tools"] = "http://schemas.android.com/tools";
    application.$["tools:replace"] = "android:appComponentFactory";
    application.$["android:appComponentFactory"] =
      "androidx.core.app.CoreComponentFactory";

    return config;
  });
};

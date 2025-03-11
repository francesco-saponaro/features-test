const { withProjectBuildGradle } = require("@expo/config-plugins");

const withAndroidGradleConfig = (config) => {
  return withProjectBuildGradle(config, (config) => {
    const buildGradle = config.modResults.contents;

    // Add the configurations block if it doesn't exist
    if (!buildGradle.includes("configurations.all")) {
      const configurationsBlock = `
    allprojects {
        configurations.all {
            resolutionStrategy {
                force 'androidx.versionedparcelable:versionedparcelable:1.1.1'
                force 'androidx.core:core:1.12.0'
                force 'androidx.lifecycle:lifecycle-runtime:2.7.0'
                force 'androidx.fragment:fragment:1.6.2'
                exclude group: 'com.android.support'
                exclude module: 'support-v4'
                exclude module: 'support-annotations'
                exclude module: 'support-fragment'
            }
        }
    }
`;

      // Find the last occurrence of allprojects block
      const lastAllProjectsIndex = buildGradle.lastIndexOf("allprojects {");
      if (lastAllProjectsIndex !== -1) {
        // Find the closing brace of the allprojects block
        const closingBraceIndex = buildGradle.indexOf(
          "}",
          lastAllProjectsIndex
        );
        if (closingBraceIndex !== -1) {
          // Insert our configurations just before the closing brace
          config.modResults.contents =
            buildGradle.slice(0, closingBraceIndex) +
            configurationsBlock +
            buildGradle.slice(closingBraceIndex);
        }
      }
    }

    return config;
  });
};

module.exports = withAndroidGradleConfig;

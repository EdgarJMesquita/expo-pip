import { withAndroidManifest, ConfigPlugin } from "expo/config-plugins";

const withMyApiKey: ConfigPlugin = (config) => {
  config = withAndroidManifest(config, (config) => {
    const { manifest } = config.modResults;

    if (!Array.isArray(manifest["application"])) {
      console.warn(
        "withAndroidMainActivityAttributes: No application array in manifest?"
      );
      return config;
    }

    // Find the "application" called ".MainApplication"
    const application = manifest["application"].find(
      (item) => item.$["android:name"] === ".MainApplication"
    );
    if (!application) {
      console.warn("addCustomActivityToMainApplication: No .MainApplication?");
      return config;
    }

    // Check if there are any activity tags
    let activities = application["activity"];

    if (!Array.isArray(activities)) {
      console.warn(
        "addCustomActivityToMainApplication: No activity array in .MainApplication?"
      );
      return config;
    }

    const activity = application.activity!.find(
      (item) => item.$["android:name"] === ".MainActivity"
    );

    activity!.$["android:supportsPictureInPicture"] = "true";

    return config;
  });

  return config;
};

export default withMyApiKey;

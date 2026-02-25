import { generateImageAsync } from "@expo/image-utils";
import {
  withAndroidManifest,
  ConfigPlugin,
  withDangerousMod,
} from "expo/config-plugins";
import {
  writeFileSync,
  existsSync,
  mkdirSync,
  unlinkSync,
  readdirSync,
} from "fs";
import { basename, resolve } from "path";

const ERROR_MSG_PREFIX = "expo-pip-plugin: ";

const ANDROID_RES_PATH = "android/app/src/main/res/";
const EXPO_PIP_ACTION_ICON_PREFIX = "expo_pip_action_icon";

async function writePipActionsIconsAsync(icons: string[], projectRoot: string) {
  await Promise.all(
    icons.map(async (icon) => {
      const drawableFolderName = "drawable";
      const drawableFolder = resolve(
        projectRoot,
        ANDROID_RES_PATH,
        drawableFolderName,
      );
      if (!existsSync(drawableFolder)) {
        mkdirSync(drawableFolder, { recursive: true });
      }
      const iconSizePx = 96;

      try {
        const resizedIcon = (
          await generateImageAsync(
            { projectRoot },
            {
              src: icon,
              width: iconSizePx,
              height: iconSizePx,
              resizeMode: "cover",
              backgroundColor: "transparent",
            },
          )
        ).source;

        const destinationPath = resolve(
          drawableFolder,
          `${EXPO_PIP_ACTION_ICON_PREFIX}_${basename(icon)}`,
        );

        writeFileSync(destinationPath, resizedIcon);
      } catch (e) {
        throw new Error(
          ERROR_MSG_PREFIX + "Encountered an issue resizing Android icon: " + e,
        );
      }
    }),
  );
}

async function removePipActionIconImageFiles(projectRoot: string) {
  const dir = resolve(projectRoot, ANDROID_RES_PATH, "drawable");

  if (!existsSync(dir)) {
    return;
  }

  const files = readdirSync(dir);

  files.forEach((file) => {
    if (file.startsWith(EXPO_PIP_ACTION_ICON_PREFIX) && existsSync(file)) {
      unlinkSync(resolve(dir, file));
    }
  });
}

const supportsPictureInPicture: ConfigPlugin<{ icons?: string[] }> = (
  config,
  props,
) => {
  config = withAndroidManifest(config, (config) => {
    const { manifest } = config.modResults;

    if (!Array.isArray(manifest["application"])) {
      console.warn(
        "withAndroidMainActivityAttributes: No application array in manifest?",
      );
      return config;
    }

    // Find the "application" called ".MainApplication"
    const application = manifest["application"].find(
      (item) => item.$["android:name"] === ".MainApplication",
    );
    if (!application) {
      console.warn("addCustomActivityToMainApplication: No .MainApplication?");
      return config;
    }

    // Check if there are any activity tags
    const activities = application["activity"];

    if (!Array.isArray(activities)) {
      console.warn(
        "addCustomActivityToMainApplication: No activity array in .MainApplication?",
      );
      return config;
    }

    const activity = application.activity!.find(
      (item) => item.$["android:name"] === ".MainActivity",
    );

    activity!.$["android:supportsPictureInPicture"] = "true";

    return config;
  });

  if (props.icons?.length) {
    config = withDangerousMod(config, [
      "android",
      async (config) => {
        await writePipActionsIconsAsync(
          props.icons!,
          config.modRequest.projectRoot,
        );
        return config;
      },
    ]);
  } else {
    config = withDangerousMod(config, [
      "android",
      async (config) => {
        await removePipActionIconImageFiles(config.modRequest.projectRoot);
        return config;
      },
    ]);
  }

  return config;
};

export default supportsPictureInPicture;

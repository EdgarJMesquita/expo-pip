import { NativeModule, requireOptionalNativeModule } from "expo";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

import {
  ExpoPipModuleEvents,
  PictureInPictureParams,
  PipModeChangeEvent,
} from "./ExpoPip.types";

const ExpoPipModule = requireOptionalNativeModule<IExpoPipModule>("ExpoPip");

declare class IExpoPipModule extends NativeModule<ExpoPipModuleEvents> {
  isInPipMode(): boolean;
  setPictureInPictureParams(options: PictureInPictureParams): void;
  enterPipMode(options?: PictureInPictureParams): void;
}

function addPictureInPictureModeListener(
  listener: (event: PipModeChangeEvent) => void
) {
  if (!ExpoPipModule) {
    console.warn(
      "expo-pip is not properly linked or it's not supported on this platform."
    );
    return {
      remove: () => {},
    };
  }
  return ExpoPipModule.addListener("onPipModeChange", listener);
}

function useIsInPip() {
  const [isInPipMode, setInPipMode] = useState(false);

  useEffect(() => {
    const subscription = addPictureInPictureModeListener(({ isInPipMode }) => {
      setInPipMode(isInPipMode);
    });

    return () => subscription.remove();
  }, [setInPipMode]);

  return { isInPipMode };
}

class ExpoPip {
  static useIsInPip: () => { isInPipMode: boolean };
  static isInPipMode(): boolean | undefined {
    return ExpoPipModule?.isInPipMode();
  }
  static setPictureInPictureParams(options: PictureInPictureParams) {
    ExpoPipModule?.setPictureInPictureParams(options);
  }
  static enterPipMode(options?: PictureInPictureParams) {
    ExpoPipModule?.enterPipMode(options);
  }
  static isAvailable() {
    return Platform.OS === "android";
  }
}

ExpoPip.useIsInPip = useIsInPip;

export default ExpoPip;

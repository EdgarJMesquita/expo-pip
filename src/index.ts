import { EventEmitter, Subscription } from "expo-modules-core";
import { useEffect, useState } from "react";

import { AspectRatioProps, PictureInPictureParams } from "./ExpoPip.types";
import ExpoPipModule from "./ExpoPipModule";

const emitter = new EventEmitter(ExpoPipModule);

export type PictureInPictureModeChangeEvent = {
  isInPictureInPictureMode: boolean;
};

export function addPictureInPictureModeListener(
  listener: (event: PictureInPictureModeChangeEvent) => void
): Subscription {
  return emitter.addListener<PictureInPictureModeChangeEvent>(
    "onPictureInPictureModeChanged",
    listener
  );
}

export function isInPipMode(): boolean {
  return ExpoPipModule.isInPipMode();
}

export function setPictureInPictureParams(options: PictureInPictureParams) {
  ExpoPipModule.setPictureInPictureParams(options);
}

export function enterPipMode(options: PictureInPictureParams = {}) {
  ExpoPipModule.enterPipMode(options);
}

export function useIsInPip() {
  const [isInPipMode, setInPipMode] = useState(false);

  useEffect(() => {
    const subscription = addPictureInPictureModeListener(
      ({ isInPictureInPictureMode }) => {
        setInPipMode(isInPictureInPictureMode);
      }
    );

    return () => subscription.remove();
  }, [setInPipMode]);

  return { isInPipMode };
}

/**
 *
 * @deprecated use `setPictureInPictureParams()`
 */
export function setAspectRatio({ height, width }: AspectRatioProps) {
  setPictureInPictureParams({
    width,
    height,
  });
}

/**
 *
 * @deprecated use `setPictureInPictureParams()`
 */
export function setAutoEnterEnabled(autoEnterEnabled: boolean) {
  setPictureInPictureParams({
    autoEnterEnabled,
  });
}

export * from "./ExpoPip.types";

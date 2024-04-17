import { useEffect, useState } from "react";
import { AppState } from "react-native";

import { AspectRatioProps } from "./ExpoPip.types";
import ExpoPipModule from "./ExpoPipModule";

export function isInPipMode(): boolean {
  return ExpoPipModule.isInPipMode();
}

export function enterPipMode(props?: AspectRatioProps) {
  const defaultParams = {
    width: 200,
    height: 300,
  };

  props ||= defaultParams;

  ExpoPipModule.enterPipMode(props.width, props.height);
}

export function setAspectRatio({ width, height }: AspectRatioProps) {
  ExpoPipModule.setAspectRatio(width, height);
}

export function setAutoEnterEnabled(isAutomatic: boolean) {
  ExpoPipModule.setAutoEnterEnabled(isAutomatic);
}

export function useIsInPip() {
  const [isInPipMode, setInPipMode] = useState(false);

  useEffect(() => {
    AppState.addEventListener("change", (event) => {
      setInPipMode(ExpoPipModule.isInPipMode());
    });
  }, []);

  return { isInPipMode };
}

import ExpoPipModule from "./ExpoPipModule";
import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { EnterPipModeProps } from "./ExpoPip.types";

export function isInPipMode(): boolean {
  return ExpoPipModule.isInPipMode();
}

export function enterPipMode(props?: EnterPipModeProps) {
  const defaultParams = {
    width: 200,
    height: 300,
  };

  props ||= defaultParams;

  ExpoPipModule.enterPipMode(props.width, props.height);
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

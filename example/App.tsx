import ExpoPip, { SourceRectHint } from "expo-pip";
import { useState, useCallback } from "react";
import {
  LayoutChangeEvent,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const { isInPipMode } = ExpoPip.useIsInPip();
  const [automaticEnterEnabled, setAutomaticEnterEnabled] = useState(false);
  const [sourceRectHint, setSourceRectHint] = useState<SourceRectHint>();

  function onWatchLayout(event: LayoutChangeEvent) {
    if (sourceRectHint) return;

    const { y, x, height, width } = event.nativeEvent.layout;
    const rect = { left: x, top: y, right: x + width, bottom: y + height };
    setSourceRectHint(rect);

    ExpoPip.setPictureInPictureParams({
      sourceRectHint: rect,
      width: 200,
      height: 100,
      seamlessResizeEnabled: false,
      title: "Custom Clock",
    });
  }

  const handlePipModeToggle = () => {
    ExpoPip.enterPipMode({
      width: 200,
      height: 100,
      sourceRectHint,
    });
  };

  const handleAutomaticEnterToggle = () => {
    setAutomaticEnterEnabled((prev) => {
      const newValue = !prev;
      ExpoPip.setPictureInPictureParams({ autoEnterEnabled: newValue });
      return newValue;
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="#000" />
      <View style={styles.watchContainer} onLayout={onWatchLayout}>
        <Text style={[styles.title, isInPipMode && styles.inPipTitle]}>
          {isInPipMode ? "You are in PIP mode 😎" : "Not in PIP mode"}
        </Text>
      </View>
      {!isInPipMode && (
        <>
          <TouchableOpacity onPress={handlePipModeToggle} style={styles.button}>
            <Text style={styles.buttonText}>Enter PiP Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleAutomaticEnterToggle}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              Toggle automaticEnter: {automaticEnterEnabled ? "on" : "off"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  watchContainer: {
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 32,
    textAlign: "center",
  },
  inPipTitle: {
    fontSize: 24,
  },
  button: {
    backgroundColor: "#2f2e3a",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  buttonText: {
    color: "#fff",
  },
});

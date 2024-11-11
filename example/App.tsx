import { format } from "date-fns";
import * as ExpoPip from "expo-pip";
import { useEffect, useState, useCallback } from "react";
import {
  LayoutChangeEvent,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BackgroundTimer from "react-native-background-timer";

export default function App() {
  const { isInPipMode } = ExpoPip.useIsInPip();
  const [automaticEnterEnabled, setAutomaticEnterEnabled] = useState(false);
  const [sourceRectHint, setSourceRectHint] =
    useState<ExpoPip.SourceRectHint>();
  const [dateTime, setDateTime] = useState("00:00:00");

  const updateDateTime = useCallback(() => {
    const intervalId = BackgroundTimer.setInterval(() => {
      setDateTime(format(new Date(), "HH:mm:ss"));
    }, 1000);
    return () => BackgroundTimer.clearInterval(intervalId);
  }, []);

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

  useEffect(updateDateTime, []);

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
        <Text style={[styles.hour, isInPipMode && styles.hourInPip]}>
          {dateTime}
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
  hour: {
    color: "white",
    fontSize: 60,
    fontWeight: "bold",
  },
  hourInPip: {
    fontSize: 45,
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

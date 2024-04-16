import * as ExpoPip from "expo-pip";
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function App() {
  const { isInPipMode } = ExpoPip.useIsInPip();
  const [automaticEnterEnabled, setAutomaticEnterEnabled] = useState(false);

  return (
    <View style={styles.container}>
      <Text>{isInPipMode ? "In Pip Mode 😎" : "Not In Pip Mode"}</Text>
      {!isInPipMode && (
        <>
          <Button
            onPress={() =>
              ExpoPip.enterPipMode({
                width: 300,
                height: 300,
              })
            }
            title="Go to Picture In Picture Mode"
          />
          <Button
            onPress={() => {
              const newValue = !automaticEnterEnabled;
              setAutomaticEnterEnabled(newValue);
              ExpoPip.setAutoEnterEnabled(newValue);
            }}
            title={`Toggle automaticEnter: ${automaticEnterEnabled ? "on" : "off"}`}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

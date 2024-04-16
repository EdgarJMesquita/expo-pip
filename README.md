# expo-pip

Picture In Picture for Android

# API documentation

- [Documentation for the main branch](https://github.com/expo/expo/blob/main/docs/pages/versions/unversioned/sdk/pip.md)
- [Documentation for the latest stable release](https://docs.expo.dev/versions/latest/sdk/pip/)

# Installation in managed Expo projects

For [managed](https://docs.expo.dev/archive/managed-vs-bare/) Expo projects, please follow the installation instructions in the [API documentation for the latest stable release](#api-documentation). If you follow the link and there is no documentation available then this library is not yet usable within managed projects &mdash; it is likely to be included in an upcoming Expo SDK release.

# Installation in bare React Native projects

For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

### Add the package to your npm dependencies

```
npx expo install expo-pip
```

# Usage

### Import expo-pip

```js
import * as ExpoPip from "expo-pip";
```

### useIsInPipe hook

```js
const { isInPipMode } = ExpoPip.useIsInPip();
```

### setAutomaticEnterEnabled

```js
ExpoPip.setAutoEnterEnabled(true);
```

### Full example

```js
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
                width: 200,
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
```

# Contributing

Contributions are very welcome! Please refer to guidelines described in the [contributing guide](https://github.com/expo/expo#contributing).

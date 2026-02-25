# expo-pip

A library that provides access to Picture In Picture API for Android only.

_expo-pip_ is not available in Expo Go, learn more about [development builds](https://docs.expo.dev/develop/development-builds/introduction/).

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

### Make sure expo-pip plugin is listed in plugins list

```json
// app.json
{
  "expo": {
    // ...
    "plugins": [
      // ...
      "expo-pip"
    ]
  }
}
```

# Demo

<a href="https://github.com/EdgarJMesquita/expo-pip"><img src="./docs/assets/demo.gif" width="360"></a>

# Usage

```js
import ExpoPip from "expo-pip";
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
            title="Enter Pip Mode"
          />
          <Button
            onPress={() => {
              const newValue = !automaticEnterEnabled;
              setAutomaticEnterEnabled(newValue);
              ExpoPip.setPictureInPictureParams({
                autoEnterEnabled: newValue,
              });
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

## Custom PiP Actions
To use custom Picture-in-Picture actions, you must declare the icons in the plugin configuration inside your `app.json`.

```json
// app.json
{
  "expo": {
    // ...
   "plugins": [
    // ..
      [
        "expo-pip",
        {
          "icons": [
            "./assets/play_pause.png",
          ]
        }
      ]
    ]
  }
}
```

### Mapping `iconName`

Once the icons are registered in the plugin configuration, reference them using `iconName` property.
The `iconName` must match the icon file name passed in the plugin configuration.

| File Name        | `iconName` Value |
| ---------------- | ---------------- |
| `play_pause.png` | `"play_pause"`   |



```ts
ExpoPip.setPictureInPictureParams({
  actions: [
    {
      iconName: "play_pause",
      action: "custom-play-pause-action",
      title: "Custom Play/Pause Action",
      description: "This is a description for the custom play/pause action",
    },
  ],
});
```

### Listening to Custom Actions Press Event
```ts
useEffect(() => {
  const subscription = ExpoPip.addEventListener(
    "onPipActionPressed",
    (event) => {
      event.action; // custom-play-pause-action
    },
  );
  return () => subscription.remove();
}, []);
```

### Icons recommendations
- Icons must be monochromatic white
- Transparent background
- Square image recommended
- 96×96px recommended resolution
- File name must:
    - Be lowercase
    - Use only letters, numbers and underscores

#

# API

```js
import ExpoPip from "expo-pip";
```

## Methods

### `setPictureInPictureParams`

Sets parameters for the Picture-In-Picture mode, accepting `PictureInPictureParams`

```typescript
ExpoPip.setPictureInPictureParams({
  width: 300,
  height: 400,
  title: "My Cool Pip Feature",
  seamlessResizeEnabled: false,
  autoEnterEnabled: true,
  actions: [
    {
      iconName: "play_pause",
      action: "custom-play-pause-action",
      title: "Custom Play/Pause Action",
      description: "This is a description for the custom play/pause action",
    },
  ],
});
```

### `enterPipMode`

```ts
ExpoPip.enterPipMode({ width: 200, height: 300 });
```

### `isAvailable`

```ts
ExpoPip.isAvailable();
```

### `getMaxNumPictureInPictureActions`

```ts
ExpoPip.getMaxNumPictureInPictureActions();
```

## Hooks

### Receive updates about Picture In Picture Mode changes

```js
const { isInPipMode } = ExpoPip.useIsInPip();
```

## Configuration Options

| Property                | Type                     | Default | Description                                    |
| ----------------------- | ------------------------ | ------- | ---------------------------------------------- |
| `width`                 | `number \| null`         | `null`  | Desired width                                  |
| `height`                | `number \| null`         | `null`  | Desired height                                 |
| `title`                 | `string \| null`         | `null`  | Title displayed on the PiP window.             |
| `subtitle`              | `string \| null`         | `null`  | Subtitle for additional information.           |
| `seamlessResizeEnabled` | `boolean \| null`        | `false` | Enables seamless resizing while in PiP.        |
| `autoEnterEnabled`      | `boolean \| null`        | `false` | Enables automatic entry into PiP mode.         |
| `sourceRectHint`        | `SourceRectHint \| null` | `null`  | Sets the source rectangle coordinates for PiP. |
| `actions`        | `PipAction \| null` | `null`  | Sets the desired custom actions. |

## Interfaces

### `PictureInPictureParams`

Defines configuration parameters for Picture-In-Picture mode.

```typescript
type PictureInPictureParams = {
  width?: number | null;
  height?: number | null;
  title?: string | null; /
  subtitle?: string | null;
  sourceRectHint?: SourceRectHint;
  actions?: PipAction[]
};
```

### `SourceRectHint`

Defines the bounds for the PiP window, improving transition smoothness.

```typescript
type SourceRectHint = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};
```

### `PipAction`

Defines the custom actions to be shown in the PIP View.

```typescript
type PipAction = {
  iconName: string;
  action: string;
  title?: string;
  description?: string;
};
```

# Contributing

Contributions are very welcome! Please refer to guidelines described in the [contributing guide](https://github.com/expo/expo#contributing).

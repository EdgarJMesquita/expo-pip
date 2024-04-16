import { StyleSheet, Text, View } from 'react-native';

import * as ExpoPip from 'expo-pip';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ExpoPip.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

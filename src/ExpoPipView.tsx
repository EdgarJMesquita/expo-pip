import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ExpoPipViewProps } from './ExpoPip.types';

const NativeView: React.ComponentType<ExpoPipViewProps> =
  requireNativeViewManager('ExpoPip');

export default function ExpoPipView(props: ExpoPipViewProps) {
  return <NativeView {...props} />;
}

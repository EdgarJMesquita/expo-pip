import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ExpoPip.web.ts
// and on native platforms to ExpoPip.ts
import ExpoPipModule from './ExpoPipModule';
import ExpoPipView from './ExpoPipView';
import { ChangeEventPayload, ExpoPipViewProps } from './ExpoPip.types';

// Get the native constant value.
export const PI = ExpoPipModule.PI;

export function hello(): string {
  return ExpoPipModule.hello();
}

export async function setValueAsync(value: string) {
  return await ExpoPipModule.setValueAsync(value);
}

const emitter = new EventEmitter(ExpoPipModule ?? NativeModulesProxy.ExpoPip);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ExpoPipView, ExpoPipViewProps, ChangeEventPayload };

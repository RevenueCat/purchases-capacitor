import { registerPlugin } from '@capacitor/core';

import { Purchases } from '../src/index';

// Compared against a real registered plugin rather than a fixture: this fails when a
// Capacitor release starts attaching something new that the wrapper would drop.
const capacitorPlugin = registerPlugin('Parity', { web: () => Promise.resolve({} as never) }) as unknown as Record<
  string,
  (...args: unknown[]) => unknown
>;

const ours = Purchases as unknown as Record<string, (...args: unknown[]) => unknown>;

const shapeOf = (value: object) =>
  Reflect.ownKeys(value)
    .map((key) => {
      const descriptor = Object.getOwnPropertyDescriptor(value, key)!;
      return `${String(key)} w=${descriptor.writable} c=${descriptor.configurable} e=${descriptor.enumerable}`;
    })
    .sort();

const METHODS = ['getOfferings', 'logIn', 'trackCustomPaywallImpression', 'addListener', 'removeAllListeners'];

// Neither plugin is implemented under jest, so every call rejects once it settles.
const callAndSettle = (plugin: Record<string, (...args: unknown[]) => unknown>, method: string) => {
  const returned = plugin[method]('anEvent', () => undefined) as Promise<unknown>;
  const shape = shapeOf(returned);
  returned.catch(() => undefined);
  return shape;
};

describe('parity with what Capacitor hands back', () => {
  it.each(METHODS)('keeps every property Capacitor puts on %s', (method) => {
    expect(shapeOf(ours[method])).toEqual(shapeOf(capacitorPlugin[method]));
    expect(ours[method].name).toBe(capacitorPlugin[method].name);
    expect(String(ours[method])).toBe(String(capacitorPlugin[method]));
  });

  it.each(METHODS)('keeps every property Capacitor puts on the promise %s returns', (method) => {
    expect(callAndSettle(ours, method)).toEqual(callAndSettle(capacitorPlugin, method));
  });
});

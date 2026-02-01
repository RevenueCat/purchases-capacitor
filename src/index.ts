import { registerPlugin } from '@capacitor/core';

import type { PurchasesPlugin } from './definitions';

const PurchasesNative = registerPlugin<PurchasesPlugin>('Purchases', {
  web: () => import('./web').then((m) => new m.PurchasesWeb()),
});

function serializeArguments(args: any[]): any[] {
  return args.map(arg => {
    if (arg === null || arg === undefined) {
      return arg;
    }
    
    if (typeof arg === 'object') {
      try {
        return JSON.parse(JSON.stringify(arg));
      } catch (e) {
        console.warn('[Purchases] Failed to serialize argument, passing as-is:', e);
        return arg;
      }
    }
    
    return arg;
  });
}

function wrapMethod<T extends (...args: any[]) => any>(
  method: T,
  target: any,
  methodName: string | symbol
): T {
  const wrappedFn = function(this: any, ...args: any[]) {
    const serializedArgs = serializeArguments(args);
    const result = method.apply(target, serializedArgs);
    return result;
  };
  
  Object.defineProperty(wrappedFn, 'name', {
    value: typeof methodName === 'string' ? methodName : String(methodName),
    configurable: true,
  });
  
  return wrappedFn as T;
}

const methodCache = new Map<string | symbol, any>();

const Purchases = new Proxy(PurchasesNative, {
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver);
    
    if (typeof value === 'function') {
      if (!methodCache.has(prop)) {
        methodCache.set(prop, wrapMethod(value, target, prop));
      }
      return methodCache.get(prop);
    }
    
    return value;
  },
});

export * from './definitions';
export { Purchases };

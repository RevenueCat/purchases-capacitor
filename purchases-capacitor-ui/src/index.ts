import { registerPlugin } from '@capacitor/core';

import type { RevenueCatUIPlugin } from './definitions';

const RevenueCatUINative = registerPlugin<RevenueCatUIPlugin>('RevenueCatUI', {
  web: () => import('./web').then((m) => new m.RevenueCatUIWeb()),
});

function unwrapCapacitorError(error: any): any {
  if (error?.data && typeof error.data === 'object') {
    console.log('[RevenueCatUI] Unwrapping Capacitor error');
    console.log('[RevenueCatUI] Original error:', JSON.stringify(error, null, 2));
    const unwrapped = {
      ...error,
      ...error.data,
    };
    console.log('[RevenueCatUI] Unwrapped error:', JSON.stringify(unwrapped, null, 2));
    return unwrapped;
  }
  console.log('[RevenueCatUI] Error does not need unwrapping:', error);
  return error;
}

function wrapMethod<T extends (...args: any[]) => any>(
  method: T,
  target: any,
  methodName: string | symbol
): T {
  const wrappedFn = function(this: any, ...args: any[]) {
    const result = method.apply(target, args);
    
    if (result && typeof result === 'object' && typeof result.then === 'function') {
      return result.catch((error: any) => {
        throw unwrapCapacitorError(error);
      });
    }
    
    return result;
  };
  
  Object.defineProperty(wrappedFn, 'name', {
    value: typeof methodName === 'string' ? methodName : String(methodName),
    configurable: true,
  });
  
  return wrappedFn as T;
}

const methodCache = new Map<string | symbol, any>();

const RevenueCatUI = new Proxy(RevenueCatUINative, {
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
export { PAYWALL_RESULT } from '@revenuecat/purchases-typescript-internal-esm';
export { RevenueCatUI };

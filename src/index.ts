import { registerPlugin } from '@capacitor/core';

import type { PurchasesPlugin } from './definitions';

const PurchasesNative = registerPlugin<PurchasesPlugin>('Purchases', {
  web: () => import('./web').then((m) => new m.PurchasesWeb()),
});

function unwrapCapacitorError(error: any): any {
  if (error?.data && typeof error.data === 'object') {
    return {
      ...error,
      message: error.data.message,
      readableErrorCode: error.data.readableErrorCode,
      userInfo: {
        readableErrorCode: error.data.readableErrorCode,
      },
      underlyingErrorMessage: error.data.underlyingErrorMessage,
      userCancelled: error.data.userCancelled ?? null,
    };
  }
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

const Purchases = new Proxy(PurchasesNative, {
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver);

    if (typeof value === 'function') {
      if (typeof prop === 'number') {
        return value;
      }

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

import { registerPlugin } from '@capacitor/core';
import type { PluginListenerHandle } from '@capacitor/core';

import type {
  PaywallListener,
  PaywallResult,
  PresentPaywallIfNeededOptions,
  PresentPaywallOptions,
  PurchaseLogic,
  PurchaseLogicResult,
  RevenueCatUIPlugin,
} from './definitions';
import { PURCHASE_LOGIC_RESULT } from './definitions';

/**
 * Internal native plugin interface with native-only methods and events.
 * This is not exported to consumers.
 */
interface RevenueCatUINativePlugin {
  presentPaywall(options: {
    offering?: any;
    displayCloseButton?: boolean;
    hasPaywallListener?: boolean;
    hasPurchaseLogic?: boolean;
  }): Promise<PaywallResult>;
  presentPaywallIfNeeded(options: {
    offering?: any;
    displayCloseButton?: boolean;
    requiredEntitlementIdentifier: string;
    hasPaywallListener?: boolean;
    hasPurchaseLogic?: boolean;
  }): Promise<PaywallResult>;
  presentCustomerCenter(): Promise<void>;
  setMockWebResults?(options: { shouldMockWebResults: boolean }): Promise<void>;

  resumePurchaseInitiated(options: { requestId: string; shouldProceed: boolean }): Promise<void>;
  resumePurchaseLogicPurchase(options: {
    requestId: string;
    result: string;
    error?: { code?: string; message?: string };
  }): Promise<void>;
  resumePurchaseLogicRestore(options: {
    requestId: string;
    result: string;
    error?: { code?: string; message?: string };
  }): Promise<void>;

  addListener(eventName: string, listener: (data: any) => void): Promise<PluginListenerHandle>;
  removeAllListeners(): Promise<void>;
}

const nativePlugin = registerPlugin<RevenueCatUINativePlugin>('RevenueCatUI', {
  web: () => import('./web').then((m) => new m.RevenueCatUIWeb()),
});

function serializeResultForNative(result: PurchaseLogicResult): {
  result: string;
  error?: { code?: string; message?: string };
} {
  if (result.result === PURCHASE_LOGIC_RESULT.ERROR && 'error' in result && result.error) {
    return {
      result: result.result,
      error: {
        code: result.error.code,
        message: result.error.message,
      },
    };
  }
  return { result: result.result };
}

async function presentWithListenerSupport(
  nativeMethod: (options: any) => Promise<PaywallResult>,
  options: any,
  listener?: PaywallListener,
  purchaseLogic?: PurchaseLogic,
): Promise<PaywallResult> {
  const handles: PluginListenerHandle[] = [];

  try {
    // Register PaywallListener event handlers
    if (listener) {
      if (listener.onPurchaseStarted) {
        const cb = listener.onPurchaseStarted;
        handles.push(
          await nativePlugin.addListener('onPurchaseStarted', (data: any) => {
            cb({ packageBeingPurchased: data.packageBeingPurchased ?? data });
          }),
        );
      }
      if (listener.onPurchaseCompleted) {
        const cb = listener.onPurchaseCompleted;
        handles.push(
          await nativePlugin.addListener('onPurchaseCompleted', (data: any) => {
            cb({
              customerInfo: data.customerInfo,
              storeTransaction: data.storeTransaction,
            });
          }),
        );
      }
      if (listener.onPurchaseError) {
        const cb = listener.onPurchaseError;
        handles.push(
          await nativePlugin.addListener('onPurchaseError', (data: any) => {
            cb({ error: data.error ?? data });
          }),
        );
      }
      if (listener.onPurchaseCancelled) {
        const cb = listener.onPurchaseCancelled;
        handles.push(
          await nativePlugin.addListener('onPurchaseCancelled', () => {
            cb();
          }),
        );
      }
      if (listener.onRestoreStarted) {
        const cb = listener.onRestoreStarted;
        handles.push(
          await nativePlugin.addListener('onRestoreStarted', () => {
            cb();
          }),
        );
      }
      if (listener.onRestoreCompleted) {
        const cb = listener.onRestoreCompleted;
        handles.push(
          await nativePlugin.addListener('onRestoreCompleted', (data: any) => {
            cb({ customerInfo: data.customerInfo ?? data });
          }),
        );
      }
      if (listener.onRestoreError) {
        const cb = listener.onRestoreError;
        handles.push(
          await nativePlugin.addListener('onRestoreError', (data: any) => {
            cb({ error: data.error ?? data });
          }),
        );
      }
    }

    // Always register onPurchaseInitiated so we auto-resume when the user
    // doesn't provide an onPurchaseInitiated callback — otherwise the
    // purchase flow hangs waiting for a resume that never comes.
    // This must be outside the `if (listener)` block because the native
    // delegate adapter always fires this event (even with purchaseLogic only).
    const onPurchaseInitiatedCb = listener?.onPurchaseInitiated;
    handles.push(
      await nativePlugin.addListener('onPurchaseInitiated', (data: any) => {
        const requestId: string = data.requestId;
        const packageBeingPurchased = data.package ?? data.packageBeingPurchased;
        if (onPurchaseInitiatedCb) {
          onPurchaseInitiatedCb({
            packageBeingPurchased,
            resumable: {
              resume(shouldProceed = true) {
                nativePlugin.resumePurchaseInitiated({ requestId, shouldProceed });
              },
            },
          });
        } else {
          // No callback provided — auto-proceed with the purchase.
          nativePlugin.resumePurchaseInitiated({ requestId, shouldProceed: true });
        }
      }),
    );

    // Register PurchaseLogic event handlers
    if (purchaseLogic) {
      handles.push(
        await nativePlugin.addListener('onPerformPurchaseRequest', async (data: any) => {
          const requestId: string = data.requestId;
          const packageToPurchase = data.package ?? data.packageBeingPurchased ?? data.packageToPurchase;
          try {
            const result = await purchaseLogic.performPurchase({ packageToPurchase });
            await nativePlugin.resumePurchaseLogicPurchase({
              requestId,
              ...serializeResultForNative(result),
            });
          } catch (e: any) {
            await nativePlugin.resumePurchaseLogicPurchase({
              requestId,
              result: PURCHASE_LOGIC_RESULT.ERROR,
              error: { message: e?.message ?? 'Unknown error' },
            });
          }
        }),
      );
      handles.push(
        await nativePlugin.addListener('onPerformRestoreRequest', async (data: any) => {
          const requestId: string = data.requestId;
          try {
            const result = await purchaseLogic.performRestore();
            await nativePlugin.resumePurchaseLogicRestore({
              requestId,
              ...serializeResultForNative(result),
            });
          } catch (e: any) {
            await nativePlugin.resumePurchaseLogicRestore({
              requestId,
              result: PURCHASE_LOGIC_RESULT.ERROR,
              error: { message: e?.message ?? 'Unknown error' },
            });
          }
        }),
      );
    }

    // Call native with serializable-only options
    const nativeOptions = {
      ...options,
      hasPaywallListener: !!listener,
      hasPurchaseLogic: !!purchaseLogic,
    };
    // Remove non-serializable fields
    delete nativeOptions.listener;
    delete nativeOptions.purchaseLogic;

    return await nativeMethod(nativeOptions);
  } finally {
    // Clean up all registered listeners
    for (const handle of handles) {
      await handle.remove();
    }
  }
}

const RevenueCatUI: RevenueCatUIPlugin = {
  async presentPaywall(options?: PresentPaywallOptions): Promise<PaywallResult> {
    const listener = options?.listener;
    const purchaseLogic = options?.purchaseLogic;

    if (!listener && !purchaseLogic) {
      return nativePlugin.presentPaywall(options ?? {});
    }

    return presentWithListenerSupport(
      (opts) => nativePlugin.presentPaywall(opts),
      { ...options },
      listener,
      purchaseLogic,
    );
  },

  async presentPaywallIfNeeded(options: PresentPaywallIfNeededOptions): Promise<PaywallResult> {
    const listener = options?.listener;
    const purchaseLogic = options?.purchaseLogic;

    if (!listener && !purchaseLogic) {
      return nativePlugin.presentPaywallIfNeeded(options);
    }

    return presentWithListenerSupport(
      (opts) => nativePlugin.presentPaywallIfNeeded(opts),
      { ...options },
      listener,
      purchaseLogic,
    );
  },

  async presentCustomerCenter(): Promise<void> {
    return nativePlugin.presentCustomerCenter();
  },

  setMockWebResults: nativePlugin.setMockWebResults
    ? async (options: { shouldMockWebResults: boolean }): Promise<void> => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return nativePlugin.setMockWebResults!(options);
      }
    : undefined,

  addListener(
    eventName: 'paywallDisplayed' | 'paywallDismissed',
    listener: () => void,
  ): Promise<PluginListenerHandle> {
    return nativePlugin.addListener(eventName, listener);
  },

  removeAllListeners(): Promise<void> {
    return nativePlugin.removeAllListeners();
  },
};

export * from './definitions';
export { PAYWALL_RESULT } from '@revenuecat/purchases-typescript-internal-esm';
export { RevenueCatUI };

import { Capacitor, registerPlugin } from '@capacitor/core';
import type { PluginListenerHandle } from '@capacitor/core';
import { normalizePurchasesError } from '@revenuecat/purchases-typescript-internal-esm';
import type { PurchasesError } from '@revenuecat/purchases-typescript-internal-esm';

import { presentCheckpointError } from './checkpointErrors';
import type {
  CheckpointErrorKind,
  CheckpointParams,
  CheckpointResult,
  PaywallListener,
  PaywallPresentationConfiguration,
  PaywallResult,
  PresentPaywallIfNeededOptions,
  PresentPaywallOptions,
  PurchaseLogic,
  PurchaseLogicResult,
  RevenueCatUIPlugin,
} from './definitions';
import {
  FLOW_PRESENTATION_MODE,
  IOS_PAYWALL_PRESENTATION_STYLE,
  ANDROID_PAYWALL_PRESENTATION_STYLE,
  PURCHASE_LOGIC_RESULT,
} from './definitions';

/**
 * Internal native plugin interface with native-only methods and events.
 * This is not exported to consumers.
 */
interface RevenueCatUINativePlugin {
  checkpoint(options: {
    identifier: string;
    callId: string;
    hasErrorPresenter?: boolean;
    debugSimulateError?: boolean;
    customVariables?: Record<string, string | number | boolean>;
    presentationMode: FLOW_PRESENTATION_MODE;
  }): Promise<void>;
  presentPaywall(options: {
    offering?: any;
    useFullScreenPresentation?: boolean;
    displayCloseButton?: boolean;
    hasPaywallListener?: boolean;
    hasPurchaseLogic?: boolean;
    customVariables?: Record<string, string | number | boolean>;
  }): Promise<PaywallResult>;
  presentPaywallIfNeeded(options: {
    offering?: any;
    useFullScreenPresentation?: boolean;
    displayCloseButton?: boolean;
    requiredEntitlementIdentifier: string;
    hasPaywallListener?: boolean;
    hasPurchaseLogic?: boolean;
    customVariables?: Record<string, string | number | boolean>;
  }): Promise<PaywallResult>;
  showCheckpointError(options: { callId: string; requestId: string }): Promise<void>;
  completeCheckpointError(options: { callId: string; requestId: string }): Promise<void>;
  cancelCheckpointErrors(options: { callId: string }): Promise<void>;
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

function assertValidPresentationConfiguration(
  config: unknown,
): asserts config is PaywallPresentationConfiguration | undefined {
  if (config === undefined) {
    return;
  }
  if (typeof config !== 'object' || config === null) {
    throw new Error(`Invalid presentationConfiguration: expected an object or undefined.`);
  }
  const { ios, android } = config as Record<string, unknown>;
  const validIos = Object.values(IOS_PAYWALL_PRESENTATION_STYLE) as string[];
  const validAndroid = Object.values(ANDROID_PAYWALL_PRESENTATION_STYLE) as string[];
  if (ios !== undefined && !validIos.includes(ios as string)) {
    throw new Error(`Invalid presentationConfiguration.ios "${String(ios)}". Expected one of: ${validIos.join(', ')}.`);
  }
  if (android !== undefined && !validAndroid.includes(android as string)) {
    throw new Error(
      `Invalid presentationConfiguration.android "${String(android)}". Expected one of: ${validAndroid.join(', ')}.`,
    );
  }
}

function resolveNativePresentationOptions(config?: PaywallPresentationConfiguration): {
  useFullScreenPresentation?: boolean;
} {
  if (!config) {
    return {};
  }
  // iOS full-screen takes precedence as the flag that the native bridge understands
  if (config.ios === IOS_PAYWALL_PRESENTATION_STYLE.FULL_SCREEN) {
    return { useFullScreenPresentation: true };
  }
  return {};
}

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
            cb({ error: normalizePurchasesError(data.error ?? data) as PurchasesError });
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
            cb({ error: normalizePurchasesError(data.error ?? data) as PurchasesError });
          }),
        );
      }
      if (listener.onWebCheckoutOpened) {
        const cb = listener.onWebCheckoutOpened;
        handles.push(
          await nativePlugin.addListener('onWebCheckoutOpened', () => {
            cb();
          }),
        );
      }
      if (listener.onUrlOpened) {
        const cb = listener.onUrlOpened;
        handles.push(
          await nativePlugin.addListener('onUrlOpened', (data: any) => {
            cb({ url: data.url });
          }),
        );
      }
      if (listener.onInteraction) {
        handles.push(await nativePlugin.addListener('onInteraction', listener.onInteraction));
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

const checkpointCallIdPrefix = `${Date.now()}-${Math.random()}`;
let nextCheckpointCallId = 0;

const RevenueCatUI: RevenueCatUIPlugin = {
  async checkpoint(
    identifier: string,
    onPassed: (result: CheckpointResult) => void,
    params: CheckpointParams = {},
  ): Promise<() => Promise<void>> {
    if (Capacitor.getPlatform() !== 'ios' && Capacitor.getPlatform() !== 'android') {
      throw new Error('[RevenueCatUI] Checkpoints require a native iOS or Android build.');
    }
    const callId = `${checkpointCallIdPrefix}-${++nextCheckpointCallId}`;
    let active = true;
    let removal: Promise<void> | undefined;
    const requests = new Map<string, ReturnType<typeof presentCheckpointError>>();
    let errorHandle: PluginListenerHandle | undefined;
    const presenter = params.errorPresenter;
    if (presenter) {
      errorHandle = await nativePlugin.addListener(
        'checkpointError',
        (event: { callId: string; requestId: string; kind: CheckpointErrorKind; error: unknown }) => {
          if (!active || event.callId !== callId || requests.has(event.requestId)) return;
          const request = presentCheckpointError(event, presenter, nativePlugin);
          requests.set(event.requestId, request);
          void request.finished.catch((error) =>
            console.warn('[RevenueCatUI] Custom error presentation failed:', error),
          );
        },
      );
    }
    const detachErrors = async () => {
      await errorHandle?.remove();
      if (presenter) {
        await Promise.all([...requests.values()].map((request) => request.cancel()));
        await nativePlugin.cancelCheckpointErrors({ callId });
      }
    };
    // Register before starting: an unconfigured checkpoint identifier may pass immediately.
    const handle = await nativePlugin
      .addListener('checkpointPassed', (event: { callId: string; result: CheckpointResult }) => {
        if (!active || event.callId !== callId) return;
        active = false;
        removal = Promise.all([handle.remove(), detachErrors()]).then(() => undefined);
        void removal.catch((error) => console.warn('[RevenueCatUI] Failed to remove checkpoint listener:', error));
        onPassed(event.result);
      })
      .catch(async (error) => {
        await detachErrors();
        throw error;
      });
    const remove = (): Promise<void> => {
      active = false;
      return (removal ??= Promise.all([handle.remove(), detachErrors()]).then(() => undefined));
    };
    try {
      await nativePlugin.checkpoint({
        identifier,
        callId,
        ...(presenter ? { hasErrorPresenter: true, debugSimulateError: params.debugSimulateError ?? false } : {}),
        ...(params.customVariables !== undefined ? { customVariables: params.customVariables } : {}),
        presentationMode: params.presentationMode ?? FLOW_PRESENTATION_MODE.DEFAULT,
      });
    } catch (error) {
      await remove().catch((cleanupError) =>
        console.warn('[RevenueCatUI] Failed to remove checkpoint listener:', cleanupError),
      );
      throw error;
    }
    return remove;
  },

  async presentPaywall(options?: PresentPaywallOptions): Promise<PaywallResult> {
    assertValidPresentationConfiguration(options?.presentationConfiguration);

    const { presentationConfiguration, listener, purchaseLogic, ...rest } = options ?? {};
    const nativeOpts = {
      ...rest,
      ...resolveNativePresentationOptions(presentationConfiguration),
    };

    if (!listener && !purchaseLogic) {
      return nativePlugin.presentPaywall(nativeOpts);
    }

    return presentWithListenerSupport((opts) => nativePlugin.presentPaywall(opts), nativeOpts, listener, purchaseLogic);
  },

  async presentPaywallIfNeeded(options: PresentPaywallIfNeededOptions): Promise<PaywallResult> {
    assertValidPresentationConfiguration(options?.presentationConfiguration);

    const { presentationConfiguration, listener, purchaseLogic, ...rest } = options;
    const nativeOpts = {
      ...rest,
      ...resolveNativePresentationOptions(presentationConfiguration),
    };

    if (!listener && !purchaseLogic) {
      return nativePlugin.presentPaywallIfNeeded(nativeOpts);
    }

    return presentWithListenerSupport(
      (opts) => nativePlugin.presentPaywallIfNeeded(opts),
      nativeOpts,
      listener,
      purchaseLogic,
    );
  },

  async presentCustomerCenter(): Promise<void> {
    return nativePlugin.presentCustomerCenter();
  },

  setMockWebResults: nativePlugin.setMockWebResults
    ? async (options: { shouldMockWebResults: boolean }): Promise<void> => {
        return nativePlugin.setMockWebResults!(options);
      }
    : undefined,

  addListener(eventName: 'paywallDisplayed' | 'paywallDismissed', listener: () => void): Promise<PluginListenerHandle> {
    return nativePlugin.addListener(eventName, listener);
  },

  removeAllListeners(): Promise<void> {
    return nativePlugin.removeAllListeners();
  },
};

export * from './definitions';
export { PAYWALL_RESULT } from '@revenuecat/purchases-typescript-internal-esm';
export { RevenueCatUI };

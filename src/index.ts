import { registerPlugin } from '@capacitor/core';
import { normalizePurchasesError } from '@revenuecat/purchases-typescript-internal-esm';

import type { MakePurchaseResult, PurchasesPlugin, TrackCustomPaywallImpressionOptions } from './definitions';

type NativeTrackCustomPaywallImpressionOptions = Omit<TrackCustomPaywallImpressionOptions, 'offering'> & {
  presentedOfferingContext?: unknown;
};

type NativePurchasesPlugin = PurchasesPlugin & {
  purchaseWithIntroductoryOfferEligibilityJWS(options: unknown): Promise<MakePurchaseResult>;
};

const nativePlugin = registerPlugin<NativePurchasesPlugin>('Purchases', {
  web: () => import('./web').then((m) => new m.PurchasesWeb()),
});

function normalizeRejection(result: unknown): unknown {
  if (!(result instanceof Promise)) {
    return result;
  }
  const normalized = result.then(undefined, (error: unknown) => {
    throw normalizePurchasesError(error);
  });
  // addListener resolves a promise that also carries `remove`, for callers on the
  // deprecated non-awaited style; chaining would drop it.
  const remove = (result as { remove?: unknown }).remove;
  if (typeof remove === 'function') {
    (normalized as { remove?: unknown }).remove = remove;
  }
  return normalized;
}

function normalizeRedemptionError(result: unknown): unknown {
  if (!(result instanceof Promise)) {
    return result;
  }
  return result.then((redemption: { error?: unknown } | undefined) => {
    normalizePurchasesError(redemption?.error);
    return redemption;
  });
}

function getNativeTrackCustomPaywallImpressionOptions(
  options?: TrackCustomPaywallImpressionOptions,
): NativeTrackCustomPaywallImpressionOptions {
  const offering = options?.offering;
  const nativeOptions: NativeTrackCustomPaywallImpressionOptions = {};

  if (options?.paywallId != null) {
    nativeOptions.paywallId = options.paywallId;
  }

  if (offering != null) {
    nativeOptions.offeringId = offering.identifier;
    const presentedOfferingContext = offering.availablePackages[0]?.presentedOfferingContext;
    if (presentedOfferingContext != null) {
      nativeOptions.presentedOfferingContext = presentedOfferingContext;
    }
  } else if (options?.offeringId != null) {
    nativeOptions.offeringId = options.offeringId;
  }

  return nativeOptions;
}

function toNativeArgs(prop: string | symbol, args: unknown[]): unknown[] {
  if (prop !== 'trackCustomPaywallImpression') {
    return args;
  }
  return [getNativeTrackCustomPaywallImpressionOptions(args[0] as TrackCustomPaywallImpressionOptions)];
}

const Purchases = new Proxy(nativePlugin, {
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver);
    if (typeof value !== 'function') {
      return value;
    }
    // An apply trap keeps whatever Capacitor puts on the method it hands back, such as
    // the `name` and `toString` that logs and crash reports read.
    return new Proxy(value as (...callArgs: unknown[]) => unknown, {
      apply: (method, _thisArg, args) => {
        const options = args[0] as { introductoryOfferEligibilityJWS?: unknown } | undefined;
        if (
          (prop === 'purchaseStoreProduct' || prop === 'purchasePackage') &&
          options?.introductoryOfferEligibilityJWS != null
        ) {
          // A separate bridge entry point makes older native plugins reject instead of
          // silently accepting an option their existing purchase methods would discard.
          return normalizeRejection(
            nativePlugin.purchaseWithIntroductoryOfferEligibilityJWS({
              ...options,
              purchasableItemType: prop === 'purchaseStoreProduct' ? 'product' : 'package',
            }),
          );
        }
        const result = normalizeRejection(Reflect.apply(method, target, toNativeArgs(prop, args)));
        return prop === 'redeemWebPurchase' ? normalizeRedemptionError(result) : result;
      },
    });
  },
}) as PurchasesPlugin;

export * from './definitions';
export { Purchases };

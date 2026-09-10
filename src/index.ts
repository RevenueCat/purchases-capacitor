import { registerPlugin } from '@capacitor/core';
import { normalizePurchasesError } from '@revenuecat/purchases-typescript-internal-esm';

import type { PurchasesPlugin, TrackCustomPaywallImpressionOptions } from './definitions';

type NativeTrackCustomPaywallImpressionOptions = Omit<TrackCustomPaywallImpressionOptions, 'offering'> & {
  presentedOfferingContext?: unknown;
};

const nativePlugin = registerPlugin<PurchasesPlugin>('Purchases', {
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

const trackCustomPaywallImpression = (options?: TrackCustomPaywallImpressionOptions): Promise<void> =>
  normalizeRejection(
    nativePlugin.trackCustomPaywallImpression(getNativeTrackCustomPaywallImpressionOptions(options)),
  ) as Promise<void>;

const Purchases = new Proxy(nativePlugin, {
  get(target, prop, receiver) {
    if (prop === 'trackCustomPaywallImpression') {
      return trackCustomPaywallImpression;
    }

    const value = Reflect.get(target, prop, receiver);
    if (typeof value !== 'function') {
      return value;
    }
    return (...args: unknown[]) =>
      normalizeRejection((value as (...callArgs: unknown[]) => unknown).apply(target, args));
  },
}) as PurchasesPlugin;

export * from './definitions';
export { Purchases };

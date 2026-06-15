import { registerPlugin } from '@capacitor/core';

import type { PurchasesPlugin, TrackCustomPaywallImpressionOptions } from './definitions';

type NativeTrackCustomPaywallImpressionOptions = Omit<TrackCustomPaywallImpressionOptions, 'offering'> & {
  presentedOfferingContext?: unknown;
};

const nativePlugin = registerPlugin<PurchasesPlugin>('Purchases', {
  web: () => import('./web').then((m) => new m.PurchasesWeb()),
});

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

const Purchases = new Proxy(nativePlugin, {
  get(target, prop, receiver) {
    if (prop === 'trackCustomPaywallImpression') {
      return (options?: TrackCustomPaywallImpressionOptions): Promise<void> => {
        return target.trackCustomPaywallImpression(getNativeTrackCustomPaywallImpressionOptions(options));
      };
    }

    return Reflect.get(target, prop, receiver);
  },
}) as PurchasesPlugin;

export * from './definitions';
export { Purchases };

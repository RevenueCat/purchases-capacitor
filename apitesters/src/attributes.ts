import type { PurchasesPlugin } from '@revenuecat/purchases-capacitor';

async function checkAttributes(plugin: PurchasesPlugin) {
  const attributes: { [key: string]: string | null } = {};
  const stringOrNull: string | null = '';

  await plugin.setAttributes(attributes);
  await plugin.setEmail({ email: stringOrNull });
  await plugin.setPhoneNumber({ phoneNumber: stringOrNull });
  await plugin.setDisplayName({ displayName: stringOrNull });
  await plugin.setPushToken({ pushToken: stringOrNull });
  await plugin.setProxyURL({ url: '' });
  await plugin.collectDeviceIdentifiers();
  await plugin.setAdjustID({ adjustID: stringOrNull });
  await plugin.setAppsflyerID({ appsflyerID: stringOrNull });
  await plugin.setFBAnonymousID({ fbAnonymousID: stringOrNull });
  await plugin.setMparticleID({ mparticleID: stringOrNull });
  await plugin.setCleverTapID({ cleverTapID: stringOrNull });
  await plugin.setMixpanelDistinctID({ mixpanelDistinctID: stringOrNull });
  await plugin.setFirebaseAppInstanceID({
    firebaseAppInstanceID: stringOrNull,
  });
  await plugin.setOnesignalID({ onesignalID: stringOrNull });
  await plugin.setOnesignalUserID({ onesignalUserID: stringOrNull });
  await plugin.setAirshipChannelID({ airshipChannelID: stringOrNull });
  await plugin.setMediaSource({ mediaSource: stringOrNull });
  await plugin.setCampaign({ campaign: stringOrNull });
  await plugin.setAdGroup({ adGroup: stringOrNull });
  await plugin.setAd({ ad: stringOrNull });
  await plugin.setKeyword({ keyword: stringOrNull });
  await plugin.setCreative({ creative: stringOrNull });
}

/* eslint-disable @typescript-eslint/no-unused-vars */

import { WebPlugin } from '@capacitor/core';
import type {
  BILLING_FEATURE,
  CustomerInfo,
  CustomerInfoUpdateListener,
  IntroEligibility,
  LOG_LEVEL,
  LogHandler,
  LogInResult,
  MakePurchaseResult,
  PurchasesConfiguration,
  PurchasesEntitlementInfo,
  PurchasesOfferings,
  PurchasesPromotionalOffer,
  PurchasesStoreProduct,
  REFUND_REQUEST_STATUS,
  ShouldPurchasePromoProductListener,
} from '@revenuecat/purchases-typescript-internal';

import type {
  GetProductOptions,
  GetPromotionalOfferOptions,
  PurchaseDiscountedPackageOptions,
  PurchaseDiscountedProductOptions,
  PurchasePackageOptions,
  PurchasesPlugin,
  PurchaseStoreProductOptions,
  PurchaseSubscriptionOptionOptions,
  SyncObserverModeAmazonPurchaseOptions,
} from './definitions';

export class PurchasesWeb extends WebPlugin implements PurchasesPlugin {
  private webNotSupportedErrorMessage = 'Web not supported in this plugin.';

  configure(_configuration: PurchasesConfiguration): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  setFinishTransactions(_finishTransactions: {
    finishTransactions: boolean;
  }): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  setSimulatesAskToBuyInSandbox(_simulatesAskToBuyInSandbox: {
    simulatesAskToBuyInSandbox: boolean;
  }): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  addCustomerInfoUpdateListener(
    _customerInfoUpdateListener: CustomerInfoUpdateListener,
  ): Promise<string> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  removeCustomerInfoUpdateListener(
    _listenerToRemove: string,
  ): Promise<{ wasRemoved: boolean }> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  addShouldPurchasePromoProductListener(
    _shouldPurchasePromoProductListener: ShouldPurchasePromoProductListener,
  ): Promise<string> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  removeShouldPurchasePromoProductListener(
    _listenerToRemove: string,
  ): Promise<{ wasRemoved: boolean }> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  getOfferings(): Promise<PurchasesOfferings> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  getProducts(
    _options: GetProductOptions,
  ): Promise<{ products: PurchasesStoreProduct[] }> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  purchaseStoreProduct(
    _options: PurchaseStoreProductOptions,
  ): Promise<MakePurchaseResult> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  purchaseDiscountedProduct(
    _options: PurchaseDiscountedProductOptions,
  ): Promise<MakePurchaseResult> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  purchasePackage(
    _options: PurchasePackageOptions,
  ): Promise<MakePurchaseResult> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  purchaseSubscriptionOption(
    _options: PurchaseSubscriptionOptionOptions,
  ): Promise<MakePurchaseResult> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  purchaseDiscountedPackage(
    _options: PurchaseDiscountedPackageOptions,
  ): Promise<MakePurchaseResult> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  restorePurchases(): Promise<{ customerInfo: CustomerInfo }> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  getAppUserID(): Promise<{ appUserID: string }> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  logIn(_appUserID: { appUserID: string }): Promise<LogInResult> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  logOut(): Promise<{ customerInfo: CustomerInfo }> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  setLogLevel(_level: { level: LOG_LEVEL }): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  setLogHandler(_logHandler: LogHandler): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  getCustomerInfo(): Promise<{ customerInfo: CustomerInfo }> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  syncPurchases(): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  syncObserverModeAmazonPurchase(
    _options: SyncObserverModeAmazonPurchaseOptions,
  ): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  enableAdServicesAttributionTokenCollection(): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  isAnonymous(): Promise<{ isAnonymous: boolean }> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  checkTrialOrIntroductoryPriceEligibility(_productIdentifiers: {
    productIdentifiers: string[];
  }): Promise<{ [productId: string]: IntroEligibility }> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  getPromotionalOffer(
    _options: GetPromotionalOfferOptions,
  ): Promise<PurchasesPromotionalOffer | undefined> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  invalidateCustomerInfoCache(): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  presentCodeRedemptionSheet(): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  setAttributes(_attributes: { [key: string]: string | null }): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  setEmail(_email: { email: string | null }): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  setPhoneNumber(_phoneNumber: { phoneNumber: string | null }): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  setDisplayName(_displayName: { displayName: string | null }): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  setPushToken(_pushToken: { pushToken: string | null }): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  setProxyURL(_url: { url: string }): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  collectDeviceIdentifiers(): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  setAdjustID(_adjustID: { adjustID: string | null }): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  setAppsflyerID(_appsflyerID: { appsflyerID: string | null }): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  setFBAnonymousID(_fbAnonymousID: {
    fbAnonymousID: string | null;
  }): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  setMparticleID(_mparticleID: { mparticleID: string | null }): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  setCleverTapID(_cleverTapID: { cleverTapID: string | null }): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  setMixpanelDistinctID(_mixpanelDistinctID: {
    mixpanelDistinctID: string | null;
  }): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  setFirebaseAppInstanceID(_firebaseAppInstanceID: {
    firebaseAppInstanceID: string | null;
  }): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  setOnesignalID(_onesignalID: { onesignalID: string | null }): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  setAirshipChannelID(_airshipChannelID: {
    airshipChannelID: string | null;
  }): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  setMediaSource(_mediaSource: { mediaSource: string | null }): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  setCampaign(_campaign: { campaign: string | null }): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  setAdGroup(_adGroup: { adGroup: string | null }): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  setAd(_ad: { ad: string | null }): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  setKeyword(_keyword: { keyword: string | null }): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  setCreative(_creative: { creative: string | null }): Promise<void> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  canMakePayments(_features?: {
    features?: BILLING_FEATURE[];
  }): Promise<{ canMakePayments: boolean }> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  beginRefundRequestForActiveEntitlement(): Promise<{
    refundRequestStatus: REFUND_REQUEST_STATUS;
  }> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  beginRefundRequestForEntitlement(_entitlementInfo: {
    entitlementInfo: PurchasesEntitlementInfo;
  }): Promise<{ refundRequestStatus: REFUND_REQUEST_STATUS }> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  beginRefundRequestForProduct(_storeProduct: {
    storeProduct: PurchasesStoreProduct;
  }): Promise<{ refundRequestStatus: REFUND_REQUEST_STATUS }> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
  isConfigured(): Promise<{ isConfigured: boolean }> {
    return Promise.reject(this.webNotSupportedErrorMessage);
  }
}

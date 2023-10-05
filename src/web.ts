/* eslint-disable @typescript-eslint/no-unused-vars */

import { WebPlugin } from '@capacitor/core';
import type {
  BILLING_FEATURE,
  CustomerInfo,
  CustomerInfoUpdateListener,
  IN_APP_MESSAGE_TYPE,
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
  ShouldPurchasePromoProductListener,
} from '@revenuecat/purchases-typescript-internal-esm';
import { REFUND_REQUEST_STATUS } from '@revenuecat/purchases-typescript-internal-esm';

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
  private shouldMockWebResults = false;
  private webNotSupportedErrorMessage = 'Web not supported in this plugin.';

  configure(_configuration: PurchasesConfiguration): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('configure');
  }

  setMockWebResults(options: { shouldMockWebResults: boolean }): Promise<void> {
    this.shouldMockWebResults = options.shouldMockWebResults;
    return Promise.resolve();
  }

  setFinishTransactions(_finishTransactions: {
    finishTransactions: boolean;
  }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('setFinishTransactions');
  }
  setSimulatesAskToBuyInSandbox(_simulatesAskToBuyInSandbox: {
    simulatesAskToBuyInSandbox: boolean;
  }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled(
      'setSimulatesAskToBuyInSandbox',
    );
  }
  addCustomerInfoUpdateListener(
    _customerInfoUpdateListener: CustomerInfoUpdateListener,
  ): Promise<string> {
    return this.mockReturningFunctionIfEnabled(
      'addCustomerInfoUpdateListener',
      'mock-callback-id',
    );
  }
  removeCustomerInfoUpdateListener(
    _listenerToRemove: string,
  ): Promise<{ wasRemoved: boolean }> {
    return this.mockReturningFunctionIfEnabled(
      'removeCustomerInfoUpdateListener',
      { wasRemoved: false },
    );
  }
  addShouldPurchasePromoProductListener(
    _shouldPurchasePromoProductListener: ShouldPurchasePromoProductListener,
  ): Promise<string> {
    return this.mockReturningFunctionIfEnabled(
      'addShouldPurchasePromoProductListener',
      'mock-callback-id',
    );
  }
  removeShouldPurchasePromoProductListener(
    _listenerToRemove: string,
  ): Promise<{ wasRemoved: boolean }> {
    return this.mockReturningFunctionIfEnabled(
      'removeShouldPurchasePromoProductListener',
      { wasRemoved: false },
    );
  }
  getOfferings(): Promise<PurchasesOfferings> {
    const mockOfferings: PurchasesOfferings = {
      all: {},
      current: null,
    };
    return this.mockReturningFunctionIfEnabled('getOfferings', mockOfferings);
  }
  getProducts(
    _options: GetProductOptions,
  ): Promise<{ products: PurchasesStoreProduct[] }> {
    const mockProducts = { products: [] };
    return this.mockReturningFunctionIfEnabled('getProducts', mockProducts);
  }
  purchaseStoreProduct(
    _options: PurchaseStoreProductOptions,
  ): Promise<MakePurchaseResult> {
    const mockPurchaseResult: MakePurchaseResult = {
      productIdentifier: _options.product.identifier,
      customerInfo: this.mockEmptyCustomerInfo,
    };
    return this.mockReturningFunctionIfEnabled(
      'purchaseStoreProduct',
      mockPurchaseResult,
    );
  }
  purchaseDiscountedProduct(
    _options: PurchaseDiscountedProductOptions,
  ): Promise<MakePurchaseResult> {
    const mockPurchaseResult: MakePurchaseResult = {
      productIdentifier: _options.product.identifier,
      customerInfo: this.mockEmptyCustomerInfo,
    };
    return this.mockReturningFunctionIfEnabled(
      'purchaseDiscountedProduct',
      mockPurchaseResult,
    );
  }
  purchasePackage(
    _options: PurchasePackageOptions,
  ): Promise<MakePurchaseResult> {
    const mockPurchaseResult: MakePurchaseResult = {
      productIdentifier: _options.aPackage.product.identifier,
      customerInfo: this.mockEmptyCustomerInfo,
    };
    return this.mockReturningFunctionIfEnabled(
      'purchasePackage',
      mockPurchaseResult,
    );
  }
  purchaseSubscriptionOption(
    _options: PurchaseSubscriptionOptionOptions,
  ): Promise<MakePurchaseResult> {
    const mockPurchaseResult: MakePurchaseResult = {
      productIdentifier: _options.subscriptionOption.productId,
      customerInfo: this.mockEmptyCustomerInfo,
    };
    return this.mockReturningFunctionIfEnabled(
      'purchaseSubscriptionOption',
      mockPurchaseResult,
    );
  }
  purchaseDiscountedPackage(
    _options: PurchaseDiscountedPackageOptions,
  ): Promise<MakePurchaseResult> {
    const mockPurchaseResult: MakePurchaseResult = {
      productIdentifier: _options.aPackage.product.identifier,
      customerInfo: this.mockEmptyCustomerInfo,
    };
    return this.mockReturningFunctionIfEnabled(
      'purchaseDiscountedPackage',
      mockPurchaseResult,
    );
  }
  restorePurchases(): Promise<{ customerInfo: CustomerInfo }> {
    const mockResponse = { customerInfo: this.mockEmptyCustomerInfo };
    return this.mockReturningFunctionIfEnabled(
      'restorePurchases',
      mockResponse,
    );
  }
  getAppUserID(): Promise<{ appUserID: string }> {
    return this.mockReturningFunctionIfEnabled('getAppUserID', {
      appUserID: 'test-web-user-id',
    });
  }
  logIn(_appUserID: { appUserID: string }): Promise<LogInResult> {
    const mockLogInResult: LogInResult = {
      customerInfo: this.mockEmptyCustomerInfo,
      created: false,
    };
    return this.mockReturningFunctionIfEnabled('logIn', mockLogInResult);
  }
  logOut(): Promise<{ customerInfo: CustomerInfo }> {
    const mockResponse = { customerInfo: this.mockEmptyCustomerInfo };
    return this.mockReturningFunctionIfEnabled('logOut', mockResponse);
  }
  setLogLevel(_level: { level: LOG_LEVEL }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('setLogLevel');
  }
  setLogHandler(_logHandler: LogHandler): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('setLogHandler');
  }
  getCustomerInfo(): Promise<{ customerInfo: CustomerInfo }> {
    const mockResponse = { customerInfo: this.mockEmptyCustomerInfo };
    return this.mockReturningFunctionIfEnabled('getCustomerInfo', mockResponse);
  }
  syncPurchases(): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('syncPurchases');
  }
  syncObserverModeAmazonPurchase(
    _options: SyncObserverModeAmazonPurchaseOptions,
  ): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled(
      'syncObserverModeAmazonPurchase',
    );
  }
  enableAdServicesAttributionTokenCollection(): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled(
      'enableAdServicesAttributionTokenCollection',
    );
  }
  isAnonymous(): Promise<{ isAnonymous: boolean }> {
    const mockResponse = { isAnonymous: false };
    return this.mockReturningFunctionIfEnabled('isAnonymous', mockResponse);
  }
  checkTrialOrIntroductoryPriceEligibility(_productIdentifiers: {
    productIdentifiers: string[];
  }): Promise<{ [productId: string]: IntroEligibility }> {
    return this.mockReturningFunctionIfEnabled(
      'checkTrialOrIntroductoryPriceEligibility',
      {},
    );
  }
  getPromotionalOffer(
    _options: GetPromotionalOfferOptions,
  ): Promise<PurchasesPromotionalOffer | undefined> {
    return this.mockReturningFunctionIfEnabled(
      'getPromotionalOffer',
      undefined,
    );
  }
  invalidateCustomerInfoCache(): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled(
      'invalidateCustomerInfoCache',
    );
  }
  presentCodeRedemptionSheet(): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('presentCodeRedemptionSheet');
  }
  setAttributes(_attributes: { [key: string]: string | null }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('setAttributes');
  }
  setEmail(_email: { email: string | null }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('setEmail');
  }
  setPhoneNumber(_phoneNumber: { phoneNumber: string | null }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('setPhoneNumber');
  }
  setDisplayName(_displayName: { displayName: string | null }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('setDisplayName');
  }
  setPushToken(_pushToken: { pushToken: string | null }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('setPushToken');
  }
  setProxyURL(_url: { url: string }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('setProxyURL');
  }
  collectDeviceIdentifiers(): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('collectDeviceIdentifiers');
  }
  setAdjustID(_adjustID: { adjustID: string | null }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('setAdjustID');
  }
  setAppsflyerID(_appsflyerID: { appsflyerID: string | null }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('setAppsflyerID');
  }
  setFBAnonymousID(_fbAnonymousID: {
    fbAnonymousID: string | null;
  }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('setFBAnonymousID');
  }
  setMparticleID(_mparticleID: { mparticleID: string | null }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('setMparticleID');
  }
  setCleverTapID(_cleverTapID: { cleverTapID: string | null }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('setCleverTapID');
  }
  setMixpanelDistinctID(_mixpanelDistinctID: {
    mixpanelDistinctID: string | null;
  }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('setMixpanelDistinctID');
  }
  setFirebaseAppInstanceID(_firebaseAppInstanceID: {
    firebaseAppInstanceID: string | null;
  }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('setFirebaseAppInstanceID');
  }
  setOnesignalID(_onesignalID: { onesignalID: string | null }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('setOnesignalID');
  }
  setAirshipChannelID(_airshipChannelID: {
    airshipChannelID: string | null;
  }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('setAirshipChannelID');
  }
  setMediaSource(_mediaSource: { mediaSource: string | null }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('setMediaSource');
  }
  setCampaign(_campaign: { campaign: string | null }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('setCampaign');
  }
  setAdGroup(_adGroup: { adGroup: string | null }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('setAdGroup');
  }
  setAd(_ad: { ad: string | null }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('setAd');
  }
  setKeyword(_keyword: { keyword: string | null }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('setKeyword');
  }
  setCreative(_creative: { creative: string | null }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('setCreative');
  }
  canMakePayments(_features?: {
    features?: BILLING_FEATURE[];
  }): Promise<{ canMakePayments: boolean }> {
    return this.mockReturningFunctionIfEnabled('canMakePayments', {
      canMakePayments: true,
    });
  }
  beginRefundRequestForActiveEntitlement(): Promise<{
    refundRequestStatus: REFUND_REQUEST_STATUS;
  }> {
    const mockResult = {
      refundRequestStatus: REFUND_REQUEST_STATUS.USER_CANCELLED,
    };
    return this.mockReturningFunctionIfEnabled(
      'beginRefundRequestForActiveEntitlement',
      mockResult,
    );
  }
  beginRefundRequestForEntitlement(_entitlementInfo: {
    entitlementInfo: PurchasesEntitlementInfo;
  }): Promise<{ refundRequestStatus: REFUND_REQUEST_STATUS }> {
    const mockResult = {
      refundRequestStatus: REFUND_REQUEST_STATUS.USER_CANCELLED,
    };
    return this.mockReturningFunctionIfEnabled(
      'beginRefundRequestForEntitlement',
      mockResult,
    );
  }
  beginRefundRequestForProduct(_storeProduct: {
    storeProduct: PurchasesStoreProduct;
  }): Promise<{ refundRequestStatus: REFUND_REQUEST_STATUS }> {
    const mockResult = {
      refundRequestStatus: REFUND_REQUEST_STATUS.USER_CANCELLED,
    };
    return this.mockReturningFunctionIfEnabled(
      'beginRefundRequestForProduct',
      mockResult,
    );
  }

  showInAppMessages(_options?: {
    messageTypes?: IN_APP_MESSAGE_TYPE[];
  }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('showInAppMessages');
  }

  isConfigured(): Promise<{ isConfigured: boolean }> {
    const mockResult = { isConfigured: true };
    return this.mockReturningFunctionIfEnabled('isConfigured', mockResult);
  }

  // Mock helpers

  private mockEmptyCustomerInfo: CustomerInfo = {
    entitlements: { all: {}, active: {} },
    activeSubscriptions: [],
    allPurchasedProductIdentifiers: [],
    latestExpirationDate: null,
    firstSeen: '2023-08-31T15:11:21.445Z',
    originalAppUserId: 'mock-web-user-id',
    requestDate: '2023-08-31T15:11:21.445Z',
    allExpirationDates: {},
    allPurchaseDates: {},
    originalApplicationVersion: null,
    originalPurchaseDate: null,
    managementURL: null,
    nonSubscriptionTransactions: [],
  };

  private mockNonReturningFunctionIfEnabled(
    functionName: string,
  ): Promise<void> {
    if (!this.shouldMockWebResults) {
      return Promise.reject(this.webNotSupportedErrorMessage);
    }
    console.log(`${functionName} called on web with mocking enabled. No-op`);
    return Promise.resolve();
  }

  private mockReturningFunctionIfEnabled<T>(
    functionName: string,
    returnValue: T,
  ): Promise<T> {
    if (!this.shouldMockWebResults) {
      return Promise.reject(this.webNotSupportedErrorMessage);
    }
    console.log(
      `${functionName} called on web with mocking enabled. Returning mocked value`,
    );
    return Promise.resolve(returnValue);
  }
}

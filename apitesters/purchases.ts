import type {
  CustomerInfo,
  CustomerInfoUpdateListener,
  ENTITLEMENT_VERIFICATION_MODE,
  IN_APP_MESSAGE_TYPE,
  IntroEligibility,
  LOG_LEVEL,
  LogInResult,
  MakePurchaseResult,
  PurchasesEntitlementInfo,
  PurchasesOffering,
  PurchasesOfferings,
  PurchasesPackage,
  PurchasesPromotionalOffer,
  PurchasesStoreProduct,
  PurchasesStoreProductDiscount,
  PurchasesStoreTransaction,
  PurchasesVirtualCurrencies,
  PurchasesWinBackOffer,
  REFUND_REQUEST_STATUS,
  Storefront,
  SubscriptionOption,
  WebPurchaseRedemption,
  WebPurchaseRedemptionResult,
  BILLING_FEATURE,
  GoogleProductChangeInfo,
  PurchasesAreCompletedBy,
  PurchasesAreCompletedByMyApp,
  PurchasesCallbackId,
  PurchasesError,
  PurchasesPlugin,
  PurchaseParams,
  ShouldPurchasePromoProductListener,
} from '@revenuecat/purchases-capacitor';

import { PURCHASES_ARE_COMPLETED_BY_TYPE, STOREKIT_VERSION, WebPurchaseRedemptionResultType } from '@revenuecat/purchases-capacitor';

async function checkConfigure(plugin: PurchasesPlugin) {
  const apiKey: string = '';
  const appUserID: string | null = '';

  await plugin.configure({
    apiKey,
  });

  await plugin.configure({
    apiKey,
    appUserID,
  });

  const purchasesAreCompletedByRC: PurchasesAreCompletedBy = PURCHASES_ARE_COMPLETED_BY_TYPE.REVENUECAT;
  await plugin.configure({
    apiKey,
    appUserID,
    purchasesAreCompletedBy: purchasesAreCompletedByRC,
  });

  const purchasesAreCompletedByMyApp: PurchasesAreCompletedByMyApp = {
    type: PURCHASES_ARE_COMPLETED_BY_TYPE.MY_APP,
    storeKitVersion: STOREKIT_VERSION.STOREKIT_1,
  };
  await plugin.configure({
    apiKey,
    appUserID,
    purchasesAreCompletedBy: purchasesAreCompletedByMyApp,
  });

  await plugin.configure({
    apiKey,
    appUserID,
    useAmazon: true,
  });

  await plugin.configure({
    apiKey,
    appUserID,
    shouldShowInAppMessagesAutomatically: true,
  });

  await plugin.configure({
    apiKey,
    appUserID,
    entitlementVerificationMode: 'DISABLED' as ENTITLEMENT_VERIFICATION_MODE,
  });

  await plugin.configure({
    apiKey,
    appUserID,
    userDefaultsSuiteName: 'suite',
    storeKitVersion: STOREKIT_VERSION.STOREKIT_2,
    pendingTransactionsForPrepaidPlansEnabled: true,
    diagnosticsEnabled: true,
    automaticDeviceIdentifierCollectionEnabled: false,
    preferredUILocaleOverride: 'en-US',
  });

  const isConfiguredResult: { isConfigured: boolean } = await plugin.isConfigured();
}

async function checkOfferings(plugin: PurchasesPlugin) {
  const offerings: PurchasesOfferings = await plugin.getOfferings();

  const placementOffering: PurchasesOffering | null = await plugin.getCurrentOfferingForPlacement({
    placementIdentifier: 'test',
  });

  const syncedOfferings: PurchasesOfferings = await plugin.syncAttributesAndOfferingsIfNeeded();
}

async function checkProducts(plugin: PurchasesPlugin) {
  const result: { products: PurchasesStoreProduct[] } = await plugin.getProducts({ productIdentifiers: ['product1'] });

  const resultWithType: { products: PurchasesStoreProduct[] } = await plugin.getProducts({
    productIdentifiers: ['product1'],
    type: 'SUBSCRIPTION' as any,
  });
}

async function checkPurchasing(
  plugin: PurchasesPlugin,
  product: PurchasesStoreProduct,
  discount: PurchasesStoreProductDiscount,
  paymentDiscount: PurchasesPromotionalOffer,
  pack: PurchasesPackage,
  subscriptionOption: SubscriptionOption,
  googleProductChangeInfo: GoogleProductChangeInfo,
) {
  const result1: MakePurchaseResult = await plugin.purchaseStoreProduct({
    product,
  });
  const result2: MakePurchaseResult = await plugin.purchaseStoreProduct({
    product,
    googleProductChangeInfo,
  });
  const result3: MakePurchaseResult = await plugin.purchaseStoreProduct({
    product,
    googleProductChangeInfo,
    googleIsPersonalizedPrice: true,
  });

  const result4: MakePurchaseResult = await plugin.purchasePackage({
    aPackage: pack,
  });
  const result5: MakePurchaseResult = await plugin.purchasePackage({
    aPackage: pack,
    googleProductChangeInfo,
    googleIsPersonalizedPrice: false,
  });

  const result6: MakePurchaseResult = await plugin.purchaseSubscriptionOption({
    subscriptionOption,
  });
  const result7: MakePurchaseResult = await plugin.purchaseSubscriptionOption({
    subscriptionOption,
    googleProductChangeInfo,
    googleIsPersonalizedPrice: true,
  });

  const result8: MakePurchaseResult = await plugin.purchaseDiscountedProduct({
    product,
    discount: paymentDiscount,
  });

  const result9: MakePurchaseResult = await plugin.purchaseDiscountedPackage({
    aPackage: pack,
    discount: paymentDiscount,
  });
}

async function checkRestoreAndSync(plugin: PurchasesPlugin) {
  const restoreResult: { customerInfo: CustomerInfo } = await plugin.restorePurchases();

  const recordResult: { transaction: PurchasesStoreTransaction } = await plugin.recordPurchase({
    productID: 'product1',
  });

  await plugin.syncPurchases();
}

async function checkUsers(plugin: PurchasesPlugin) {
  const userIdResult: { appUserID: string } = await plugin.getAppUserID();
  const storefrontResult: Storefront = await plugin.getStorefront();

  const loginResult: LogInResult = await plugin.logIn({ appUserID: 'user1' });
  const logoutResult: { customerInfo: CustomerInfo } = await plugin.logOut();
  const customerInfoResult: { customerInfo: CustomerInfo } = await plugin.getCustomerInfo();
  const anonymousResult: { isAnonymous: boolean } = await plugin.isAnonymous();
}

async function checkLogLevel(plugin: PurchasesPlugin) {
  await plugin.setLogLevel({ level: 'DEBUG' as LOG_LEVEL });
  await plugin.setLogHandler((logLevel: LOG_LEVEL, message: string) => {});
}

async function checkListeners(plugin: PurchasesPlugin) {
  const listener: CustomerInfoUpdateListener = (info: CustomerInfo) => {};
  const callbackId: string = await plugin.addCustomerInfoUpdateListener(listener);
  const removeResult: { wasRemoved: boolean } = await plugin.removeCustomerInfoUpdateListener({
    listenerToRemove: callbackId,
  });
}

async function checkEligibility(plugin: PurchasesPlugin) {
  const eligibilities: { [productId: string]: IntroEligibility } =
    await plugin.checkTrialOrIntroductoryPriceEligibility({
      productIdentifiers: ['product1'],
    });
}

async function checkPromotionalOffer(
  plugin: PurchasesPlugin,
  product: PurchasesStoreProduct,
  discount: PurchasesStoreProductDiscount,
) {
  const offer: PurchasesPromotionalOffer | undefined = await plugin.getPromotionalOffer({ product, discount });
}

async function checkWinBackOffers(plugin: PurchasesPlugin, product: PurchasesStoreProduct, pack: PurchasesPackage) {
  const productOffers: { eligibleWinBackOffers: PurchasesWinBackOffer[] } =
    await plugin.getEligibleWinBackOffersForProduct({ product });

  const packageOffers: { eligibleWinBackOffers: PurchasesWinBackOffer[] } =
    await plugin.getEligibleWinBackOffersForPackage({ aPackage: pack });

  const winBackOffer = {} as PurchasesWinBackOffer;
  const purchaseProductResult: MakePurchaseResult | undefined = await plugin.purchaseProductWithWinBackOffer({
    product,
    winBackOffer,
  });

  const purchasePackageResult: MakePurchaseResult | undefined = await plugin.purchasePackageWithWinBackOffer({
    aPackage: pack,
    winBackOffer,
  });
}

async function checkRefundRequests(
  plugin: PurchasesPlugin,
  entitlementInfo: PurchasesEntitlementInfo,
  storeProduct: PurchasesStoreProduct,
) {
  const result1: { refundRequestStatus: REFUND_REQUEST_STATUS } = await plugin.beginRefundRequestForActiveEntitlement();
  const result2: { refundRequestStatus: REFUND_REQUEST_STATUS } = await plugin.beginRefundRequestForEntitlement({
    entitlementInfo,
  });
  const result3: { refundRequestStatus: REFUND_REQUEST_STATUS } = await plugin.beginRefundRequestForProduct({
    storeProduct,
  });
}

async function checkInAppMessages(plugin: PurchasesPlugin) {
  await plugin.showInAppMessages();
  await plugin.showInAppMessages({ messageTypes: [] as IN_APP_MESSAGE_TYPE[] });
}

async function checkCache(plugin: PurchasesPlugin) {
  await plugin.invalidateCustomerInfoCache();
  await plugin.presentCodeRedemptionSheet();
}

async function checkCanMakePayments(plugin: PurchasesPlugin) {
  const result1: { canMakePayments: boolean } = await plugin.canMakePayments();
  const result2: { canMakePayments: boolean } = await plugin.canMakePayments({
    features: [] as BILLING_FEATURE[],
  });
}

async function checkAmazonSync(plugin: PurchasesPlugin) {
  await plugin.syncObserverModeAmazonPurchase({
    productID: 'product1',
    receiptID: 'receipt1',
    amazonUserID: 'amazon1',
  });
  await plugin.syncObserverModeAmazonPurchase({
    productID: 'product1',
    receiptID: 'receipt1',
    amazonUserID: 'amazon1',
    isoCurrencyCode: 'USD',
    price: 9.99,
  });

  await plugin.syncAmazonPurchase({
    productID: 'product1',
    receiptID: 'receipt1',
    amazonUserID: 'amazon1',
  });
  await plugin.syncAmazonPurchase({
    productID: 'product1',
    receiptID: 'receipt1',
    amazonUserID: 'amazon1',
    isoCurrencyCode: 'USD',
    price: 9.99,
  });
}

async function checkAdServices(plugin: PurchasesPlugin) {
  await plugin.enableAdServicesAttributionTokenCollection();
}

async function checkWebRedemption(plugin: PurchasesPlugin) {
  const parseResult: { webPurchaseRedemption: WebPurchaseRedemption | null } =
    await plugin.parseAsWebPurchaseRedemption({ urlString: 'https://example.com' });

  const redemption = {} as WebPurchaseRedemption;
  const redemptionLink: string = redemption.redemptionLink;

  const redeemResult: WebPurchaseRedemptionResult = await plugin.redeemWebPurchase({
    webPurchaseRedemption: redemption,
  });
}

function checkWebPurchaseRedemptionResult(result: WebPurchaseRedemptionResult) {
  if (result.result === WebPurchaseRedemptionResultType.SUCCESS) {
    const customerInfo: CustomerInfo = result.customerInfo;
  } else if (result.result === WebPurchaseRedemptionResultType.ERROR) {
    const error: PurchasesError = result.error;
  } else if (result.result === WebPurchaseRedemptionResultType.PURCHASE_BELONGS_TO_OTHER_USER) {
    // no additional fields
  } else if (result.result === WebPurchaseRedemptionResultType.INVALID_TOKEN) {
    // no additional fields
  } else if (result.result === WebPurchaseRedemptionResultType.EXPIRED) {
    const obfuscatedEmail: string = result.obfuscatedEmail;
  }
}

function checkWebPurchaseRedemptionResultType(type: WebPurchaseRedemptionResultType): boolean {
  switch (type) {
    case WebPurchaseRedemptionResultType.SUCCESS:
      return true;
    case WebPurchaseRedemptionResultType.ERROR:
      return true;
    case WebPurchaseRedemptionResultType.PURCHASE_BELONGS_TO_OTHER_USER:
      return true;
    case WebPurchaseRedemptionResultType.INVALID_TOKEN:
      return true;
    case WebPurchaseRedemptionResultType.EXPIRED:
      return true;
  }
}

async function checkMockAndSimulate(plugin: PurchasesPlugin) {
  await plugin.setMockWebResults({ shouldMockWebResults: true });
  await plugin.setSimulatesAskToBuyInSandbox({ simulatesAskToBuyInSandbox: true });
}

async function checkVirtualCurrencies(plugin: PurchasesPlugin) {
  const result: { virtualCurrencies: PurchasesVirtualCurrencies } = await plugin.getVirtualCurrencies();
  await plugin.invalidateVirtualCurrenciesCache();
  const cachedResult: { cachedVirtualCurrencies: PurchasesVirtualCurrencies | null } =
    await plugin.getCachedVirtualCurrencies();
}

function checkMakePurchaseResult(result: MakePurchaseResult) {
  const productIdentifier: string = result.productIdentifier;
  const customerInfo: CustomerInfo = result.customerInfo;
  const transaction: PurchasesStoreTransaction = result.transaction;
}

function checkPurchaseParams(
  pack: PurchasesPackage,
  product: PurchasesStoreProduct,
  subscriptionOption: SubscriptionOption,
  googleProductChangeInfo: GoogleProductChangeInfo,
  winBackOffer: PurchasesWinBackOffer,
  discount: PurchasesPromotionalOffer,
) {
  const params1: PurchaseParams = { itemToPurchase: pack };
  const params2: PurchaseParams = { itemToPurchase: product };
  const params3: PurchaseParams = { itemToPurchase: subscriptionOption };
  const params4: PurchaseParams = {
    itemToPurchase: pack,
    googleProductChangeInfo,
    googleIsPersonalizedPrice: true,
    winBackOffer,
    discount,
  };
}

function checkShouldPurchasePromoProductListener() {
  const listener: ShouldPurchasePromoProductListener = (deferredPurchase: () => Promise<MakePurchaseResult>) => {
    deferredPurchase();
  };
}

async function checkLocaleAndPaywallImpression(plugin: PurchasesPlugin) {
  await plugin.overridePreferredUILocale({ locale: 'en-US' });
  await plugin.overridePreferredUILocale({ locale: null });
}

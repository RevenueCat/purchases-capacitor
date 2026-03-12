import type {
  GetProductOptions,
  PurchaseStoreProductOptions,
  PurchasePackageOptions,
  PurchaseSubscriptionOptionOptions,
  PurchaseDiscountedProductOptions,
  PurchaseDiscountedPackageOptions,
  SyncAmazonPurchaseOptions,
  SyncObserverModeAmazonPurchaseOptions,
  GetPromotionalOfferOptions,
  GetEligibleWinBackOffersForProductOptions,
  GetEligibleWinBackOffersForPackageOptions,
  PurchaseProductWithWinBackOfferOptions,
  PurchasePackageWithWinBackOfferOptions,
  PurchasesCallbackId,
  PRODUCT_CATEGORY,
  PurchasesStoreProduct,
  PurchasesStoreProductDiscount,
  PurchasesPackage,
  SubscriptionOption,
  GoogleProductChangeInfo,
  PurchasesPromotionalOffer,
  PurchasesWinBackOffer,
} from '../src/definitions';

function checkGetProductOptions() {
  const options: GetProductOptions = {
    productIdentifiers: ['product1', 'product2'],
  };
  const optionsWithType: GetProductOptions = {
    productIdentifiers: ['product1'],
    type: 'SUBSCRIPTION' as PRODUCT_CATEGORY,
  };
}

function checkPurchaseStoreProductOptions(
  product: PurchasesStoreProduct,
  googleProductChangeInfo: GoogleProductChangeInfo,
) {
  const options1: PurchaseStoreProductOptions = { product };
  const options2: PurchaseStoreProductOptions = {
    product,
    googleProductChangeInfo,
  };
  const options3: PurchaseStoreProductOptions = {
    product,
    googleProductChangeInfo,
    googleIsPersonalizedPrice: true,
  };
}

function checkPurchasePackageOptions(aPackage: PurchasesPackage, googleProductChangeInfo: GoogleProductChangeInfo) {
  const options1: PurchasePackageOptions = { aPackage };
  const options2: PurchasePackageOptions = {
    aPackage,
    googleProductChangeInfo,
  };
  const options3: PurchasePackageOptions = {
    aPackage,
    googleProductChangeInfo,
    googleIsPersonalizedPrice: false,
  };
}

function checkPurchaseSubscriptionOptionOptions(
  subscriptionOption: SubscriptionOption,
  googleProductChangeInfo: GoogleProductChangeInfo,
) {
  const options1: PurchaseSubscriptionOptionOptions = { subscriptionOption };
  const options2: PurchaseSubscriptionOptionOptions = {
    subscriptionOption,
    googleProductChangeInfo,
  };
  const options3: PurchaseSubscriptionOptionOptions = {
    subscriptionOption,
    googleProductChangeInfo,
    googleIsPersonalizedPrice: true,
  };
}

function checkPurchaseDiscountedProductOptions(product: PurchasesStoreProduct, discount: PurchasesPromotionalOffer) {
  const options: PurchaseDiscountedProductOptions = { product, discount };
}

function checkPurchaseDiscountedPackageOptions(aPackage: PurchasesPackage, discount: PurchasesPromotionalOffer) {
  const options: PurchaseDiscountedPackageOptions = { aPackage, discount };
}

function checkSyncAmazonPurchaseOptions() {
  const options1: SyncAmazonPurchaseOptions = {
    productID: 'product1',
    receiptID: 'receipt1',
    amazonUserID: 'amazon1',
  };
  const options2: SyncAmazonPurchaseOptions = {
    productID: 'product1',
    receiptID: 'receipt1',
    amazonUserID: 'amazon1',
    isoCurrencyCode: 'USD',
    price: 9.99,
  };
}

function checkSyncObserverModeAmazonPurchaseOptions() {
  const options1: SyncObserverModeAmazonPurchaseOptions = {
    productID: 'product1',
    receiptID: 'receipt1',
    amazonUserID: 'amazon1',
  };
  const options2: SyncObserverModeAmazonPurchaseOptions = {
    productID: 'product1',
    receiptID: 'receipt1',
    amazonUserID: 'amazon1',
    isoCurrencyCode: 'USD',
    price: 9.99,
  };
}

function checkGetPromotionalOfferOptions(product: PurchasesStoreProduct, discount: PurchasesStoreProductDiscount) {
  const options: GetPromotionalOfferOptions = { product, discount };
}

function checkGetEligibleWinBackOffersForProductOptions(product: PurchasesStoreProduct) {
  const options: GetEligibleWinBackOffersForProductOptions = { product };
}

function checkGetEligibleWinBackOffersForPackageOptions(aPackage: PurchasesPackage) {
  const options: GetEligibleWinBackOffersForPackageOptions = { aPackage };
}

function checkPurchaseProductWithWinBackOfferOptions(
  product: PurchasesStoreProduct,
  winBackOffer: PurchasesWinBackOffer,
) {
  const options: PurchaseProductWithWinBackOfferOptions = {
    product,
    winBackOffer,
  };
}

function checkPurchasePackageWithWinBackOfferOptions(aPackage: PurchasesPackage, winBackOffer: PurchasesWinBackOffer) {
  const options: PurchasePackageWithWinBackOfferOptions = {
    aPackage,
    winBackOffer,
  };
}

function checkPurchasesCallbackId() {
  const callbackId: PurchasesCallbackId = 'some-callback-id';
}

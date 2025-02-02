import type {
  CustomerInfo,
  CustomerInfoUpdateListener,
  GoogleProductChangeInfo,
  IntroEligibility,
  LogHandler,
  LogInResult,
  MakePurchaseResult,
  PurchasesConfiguration,
  PurchasesEntitlementInfo,
  PurchasesOfferings,
  PurchasesPackage,
  PurchasesPromotionalOffer,
  PurchasesStoreProduct,
  PurchasesStoreProductDiscount,
  SubscriptionOption,
  BILLING_FEATURE,
  LOG_LEVEL,
  PRODUCT_CATEGORY,
  REFUND_REQUEST_STATUS,
  IN_APP_MESSAGE_TYPE,
  PurchasesOffering,
  PurchasesStoreTransaction,
  PurchasesWinBackOffer,
} from '@revenuecat/purchases-typescript-internal-esm';

export * from '@revenuecat/purchases-typescript-internal-esm';

export type PurchasesCallbackId = string;

export interface GetProductOptions {
  /**
   * Array of product identifiers to obtain
   */
  productIdentifiers: string[];
  /**
   * Ignored in iOS.  
   * Optional type of products to fetch, can be `SUBSCRIPTION` or `NON_SUBSCRIPTION.SUBSCRIPTION` by default. 
   */
  type?: PRODUCT_CATEGORY;
}

export interface PurchaseStoreProductOptions {
  /**
   * The product you want to purchase
   */
  product: PurchasesStoreProduct;
  /**
   * Android only.  
   * Optional `GoogleProductChangeInfo` you
   * wish to upgrade from containing the `oldProductIdentifier` and the optional `prorationMode`.
   */
  googleProductChangeInfo?: GoogleProductChangeInfo | null;
  /**
   * Android and Google only.  
   * Optional boolean indicates personalized pricing on products available for purchase in the EU.
   * For compliance with EU regulations. User will see "This price has been customized for you" in the purchase dialog when true.
   * @see https://developer.android.com/google/play/billing/integrate#personalized-price for more info.
   */
  googleIsPersonalizedPrice?: boolean | null;
}

export interface PurchaseDiscountedProductOptions {
  /**
   * The product you want to purchase
   */
  product: PurchasesStoreProduct;
  /**
   * Discount to apply to this package. Retrieve this discount using `getPromotionalOffer`.
   */
  discount: PurchasesPromotionalOffer;
}

export interface GetEligibleWinBackOffersForProductOptions {
  /**
   * The product you want to fetch eligible win-back offers for
   */
  product: PurchasesStoreProduct;
}

export interface GetEligibleWinBackOffersForPackageOptions {
  /**
   * The package you want to fetch eligible win-back offers for
   */
  aPackage: PurchasesPackage;
}

export interface PurchaseProductWithWinBackOfferOptions {
  /**
   * The product you want to purchase
   */
  product: PurchasesStoreProduct;
  /**
   * Win-back offer to apply to this purchase. Retrieve this using getEligibleWinBackOffersForProduct.
   */
  winBackOffer: PurchasesWinBackOffer;
}

export interface PurchasePackageWithWinBackOfferOptions {
  /**
   * The package you want to purchase
   */
  aPackage: PurchasesPackage;
  /**
   * Win-back offer to apply to this purchase. Retrieve this using getEligibleWinBackOffersForPackage.
   */
  winBackOffer: PurchasesWinBackOffer;
}

export interface PurchasePackageOptions {
  /**
   * The Package you wish to purchase. You can get the Packages by calling `getOfferings`
   */
  aPackage: PurchasesPackage;
  /**
   * Android only.  
   * Optional `GoogleProductChangeInfo` you
   * wish to upgrade from containing the `oldProductIdentifier` and the optional `prorationMode`.
   */
  googleProductChangeInfo?: GoogleProductChangeInfo | null;
  /**
   * Android and Google only.  
   * Optional boolean indicates personalized pricing on products available for purchase in the EU.
   * For compliance with EU regulations. User will see "This price has been customized for you" in the purchase dialog when true.
   * @see https://developer.android.com/google/play/billing/integrate#personalized-price for more info.
   */
  googleIsPersonalizedPrice?: boolean | null;
}

export interface PurchaseSubscriptionOptionOptions {
  /**
   * The `SubscriptionOption` you wish to purchase. You can get the `SubscriptionOption` from `StoreProducts` by calling `getOfferings`
   */
  subscriptionOption: SubscriptionOption;
  /**
   * Android only.  
   * Optional `GoogleProductChangeInfo` you
   * wish to upgrade from containing the `oldProductIdentifier` and the optional `prorationMode`.
   */
  googleProductChangeInfo?: GoogleProductChangeInfo | null;
  /**
   * Android and Google only.  
   * Optional boolean indicates personalized pricing on products available for purchase in the EU.
   * For compliance with EU regulations. User will see "This price has been customized for you" in the purchase dialog when true.
   * @see https://developer.android.com/google/play/billing/integrate#personalized-price for more info.
   */
  googleIsPersonalizedPrice?: boolean | null;
}

export interface PurchaseDiscountedPackageOptions {
  /**
   * The Package you wish to purchase. You can get the Packages by calling `getOfferings`
   */
  aPackage: PurchasesPackage;
  /**
   * Discount to apply to this package. Retrieve this discount using `getPromotionalOffer`.
   */
  discount: PurchasesPromotionalOffer;
}

export interface SyncAmazonPurchaseOptions {
  /**
   * Product ID associated to the purchase.
   */
  productID: string;
  /**
   * ReceiptId that represents the Amazon purchase.
   */
  receiptID: string;
  /**
   * Amazon's userID. This parameter will be ignored when syncing a Google purchase.
   */
  amazonUserID: string;
  /**
   * Product's currency code in ISO 4217 format.
   */
  isoCurrencyCode?: string | null;
  /**
   * Product's price.
   */
  price?: number | null;
}

/**
 * @deprecated Use `SyncAmazonPurchaseOptions` instead
 */
export type SyncObserverModeAmazonPurchaseOptions = SyncAmazonPurchaseOptions;

export interface GetPromotionalOfferOptions {
  /**
   * The `PurchasesStoreProduct` the user intends to purchase.
   */
  product: PurchasesStoreProduct;
  /**
   * The `PurchasesStoreProductDiscount` to apply to the product.
   */
  discount: PurchasesStoreProductDiscount;
}

export interface PurchasesPlugin {
  /**
   * Sets up Purchases with your API key and an app user id.
   * @param {PurchasesConfiguration} configuration RevenueCat configuration object including the API key and other optional parameters. See {@link PurchasesConfiguration}
   */
  configure(configuration: PurchasesConfiguration): Promise<void>;

  /**
   * Sets whether the SDK should return mocked results in the web version.
   * This won't affect the iOS and Android versions of the implementation.
   * Default is `false`
   * @param options Set `shouldMockWebResults` to true if you want the plugin methods to return mocked values
   */
  setMockWebResults(options: { shouldMockWebResults: boolean }): Promise<void>;

  /**
   * iOS only.
   * @param options Set this property to true *only* when testing the ask-to-buy / SCA
   * purchases flow. More information: http://errors.rev.cat/ask-to-buy
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet.
   */
  setSimulatesAskToBuyInSandbox(options: { simulatesAskToBuyInSandbox: boolean }): Promise<void>;

  /**
   * Sets a function to be called on updated customer info
   * @param {CustomerInfoUpdateListener} customerInfoUpdateListener `CustomerInfo` update listener
   */
  addCustomerInfoUpdateListener(customerInfoUpdateListener: CustomerInfoUpdateListener): Promise<PurchasesCallbackId>;

  /**
   * Removes a given `CustomerInfoUpdateListener`
   * @param {CustomerInfoUpdateListener} options Include `listenerToRemove`, which is a `CustomerInfoUpdateListener`
   * reference of the listener to remove
   * @returns Promise with boolean. True if listener was removed, false otherwise
   */
  removeCustomerInfoUpdateListener(options: {
    listenerToRemove: PurchasesCallbackId;
  }): Promise<{ wasRemoved: boolean }>;

  // TODO: Support addShouldPurchasePromoProductListener functionality
  // /**
  //  * Sets a function to be called on purchases initiated on the Apple App Store. This is only used in iOS.
  //  * @param {ShouldPurchasePromoProductListener} shouldPurchasePromoProductListener Called when a user initiates a
  //  * promotional in-app purchase from the App Store. If your app is able to handle a purchase at the current time, run
  //  * the deferredPurchase function. If the app is not in a state to make a purchase: cache the deferredPurchase, then
  //  * call the deferredPurchase when the app is ready to make the promotional purchase.
  //  * If the purchase should never be made, you don't need to ever call the deferredPurchase and the app will not
  //  * proceed with promotional purchases.
  //  */
  // addShouldPurchasePromoProductListener(
  //   shouldPurchasePromoProductListener: ShouldPurchasePromoProductListener,
  // ): Promise<PurchasesCallbackId>;
  //
  // /**
  //  * Removes a given ShouldPurchasePromoProductListener
  //  * @param {ShouldPurchasePromoProductListener} listenerToRemove ShouldPurchasePromoProductListener reference of
  //  * the listener to remove
  //  * @returns Promise with boolean. True if listener was removed, false otherwise
  //  */
  // removeShouldPurchasePromoProductListener(
  //   listenerToRemove: PurchasesCallbackId,
  // ): Promise<{ wasRemoved: boolean }>;

  /**
   * Gets the map of entitlements -> offerings -> products
   * @returns {Promise<PurchasesOfferings>} Promise of entitlements structure. The promise will be rejected if configure
   * has not been called yet.
   */
  getOfferings(): Promise<PurchasesOfferings>;

  /**
   * Retrieves a current offering for a placement identifier, use this to access offerings defined by targeting
   * placements configured in the RevenueCat dashboard.
   * @returns {Promise<PurchasesOffering | null>} Promise of optional offering. The promise will be rejected if configure
   * has not been called yet.
   */
  getCurrentOfferingForPlacement(options: { placementIdentifier: string }): Promise<PurchasesOffering | null>;

  /**
   * Syncs subscriber attributes and then fetches the configured offerings for this user. This method is intended to
   * be called when using Targeting Rules with Custom Attributes. Any subscriber attributes should be set before
   * calling this method to ensure the returned offerings are applied with the latest subscriber attributes.
   * @returns {Promise<PurchasesOfferings>} Promise of entitlements structure. The promise will be rejected if configure
   * has not been called yet.
   */
  syncAttributesAndOfferingsIfNeeded(): Promise<PurchasesOfferings>;

  /**
   * Fetch the product info
   * @returns {Promise<PurchasesStoreProduct[]>} A promise containing an array of products. The promise will be rejected
   * if the products are not properly configured in RevenueCat or if there is another error retrieving them.
   * Rejections return an error code, and a userInfo object with more information. The promise will also be rejected
   * if configure has not been called yet.
   */
  getProducts(options: GetProductOptions): Promise<{ products: PurchasesStoreProduct[] }>;

  /**
   * Make a purchase
   *
   * @returns {Promise<{ productIdentifier: string, customerInfo:CustomerInfo }>} A promise of an object containing
   * a customer info object and a product identifier. Rejections return an error code,
   * a boolean indicating if the user cancelled the purchase, and an object with more information. The promise will
   * also be rejected if configure has not been called yet.
   */
  purchaseStoreProduct(options: PurchaseStoreProductOptions): Promise<MakePurchaseResult>;

  /**
   * iOS only.  
   * Purchase a product applying a given discount.
   *
   * @returns {Promise<{ productIdentifier: string, customerInfo:CustomerInfo }>} A promise of an object containing
   * a customer info object and a product identifier. Rejections return an error code,
   * a boolean indicating if the user cancelled the purchase, and an object with more information. The promise will be
   * rejected if configure has not been called yet.
   */
  purchaseDiscountedProduct(options: PurchaseDiscountedProductOptions): Promise<MakePurchaseResult>;

  /**
   * Make a purchase
   *
   * @returns {Promise<{ productIdentifier: string, customerInfo: CustomerInfo }>} A promise of an object containing
   * a customer info object and a product identifier. Rejections return an error code, a boolean indicating if the
   * user cancelled the purchase, and an object with more information. The promise will be also be rejected if configure
   * has not been called yet.
   */
  purchasePackage(options: PurchasePackageOptions): Promise<MakePurchaseResult>;

  /**
   * Google only.  
   * Make a purchase of a `subscriptionOption`
   *
   * @returns {Promise<{ productIdentifier: string, customerInfo: CustomerInfo }>} A promise of an object containing
   * a customer info object and a product identifier. Rejections return an error code, a boolean indicating if the
   * user cancelled the purchase, and an object with more information. The promise will be also be rejected if configure
   * has not been called yet.
   */
  purchaseSubscriptionOption(options: PurchaseSubscriptionOptionOptions): Promise<MakePurchaseResult>;

  /**
   * iOS only.  
   * Purchase a package applying a given discount.
   *
   * @returns {Promise<{ productIdentifier: string, customerInfo: CustomerInfo }>} A promise of an object containing
   * a customer info object and a product identifier. Rejections return an error code, a boolean indicating if the
   * user cancelled the purchase, and an object with more information. The promise will be also be rejected if configure
   * has not been called yet.
   */
  purchaseDiscountedPackage(options: PurchaseDiscountedPackageOptions): Promise<MakePurchaseResult>;

  /**
   * Restores a user's previous purchases and links their `appUserID`'s to any user's also using those purchases.
   * @returns {Promise<{ customerInfo: CustomerInfo }>} A promise of a customer info object. Rejections return an error code, and an
   * userInfo object with more information. The promise will be also be rejected if configure has not been called yet.
   */
  restorePurchases(): Promise<{ customerInfo: CustomerInfo }>;

  /**
   * Use this method only if you already have your own IAP implementation using StoreKit 2 and want to use
   * RevenueCat's backend. If you are using StoreKit 1 for your implementation, you do not need this method.
   *
   * You only need to use this method with *new* purchases. Subscription updates are observed automatically.
   * @param options The `productID` that was purchased that needs to be synced with RevenueCat's backend.
   */
  recordPurchase(options: { productID: string }): Promise<{ transaction: PurchasesStoreTransaction }>;

  /**
   * Get the `appUserID`
   * @returns {Promise<string>} The app user id in a promise
   */
  getAppUserID(): Promise<{ appUserID: string }>;

  /**
   * This function will log in the current user with an `appUserID`. Typically, this would be used after a log in
   * to identify a user without calling configure.
   * @param options The `appUserID` that should be linked to the current user
   * @returns {Promise<LogInResult>} A promise of an object that contains the customerInfo after logging in, as well
   * as a boolean indicating whether the user has just been created for the first time in the RevenueCat backend. The
   * promise will be rejected if configure has not been called yet or if there's an issue logging in.
   */
  logIn(options: { appUserID: string }): Promise<LogInResult>;

  /**
   * Logs out the Purchases client clearing the saved `appUserID`. This will generate a random user id and save it in the cache.
   * @returns {Promise<{ customerInfo: CustomerInfo }>} A promise of a customer info object. Rejections return an error code,
   * and a userInfo object with more information. The promise will be rejected if configure has not been called yet or if
   * there's an issue logging out.
   */
  logOut(): Promise<{ customerInfo: CustomerInfo }>;

  /**
   * Used to set the log level. Useful for debugging issues with the lovely team @RevenueCat.
   * The default is `LOG_LEVEL.INFO` in release builds and `LOG_LEVEL.DEBUG` in debug builds.
   * @param options Log level to use to display logs.
   */
  setLogLevel(options: { level: LOG_LEVEL }): Promise<void>;

  /**
   * Set a custom log handler for redirecting logs to your own logging system.
   * By default, this sends info, warning, and error messages.
   * If you wish to receive Debug level messages, see {@link setLogLevel}.
   * @param {LogHandler} logHandler It will get called for each log event.
   * Use this function to redirect the log to your own logging system
   */
  setLogHandler(logHandler: LogHandler): Promise<void>;

  /**
   * Gets current customer info
   * @returns {Promise<{ customerInfo: CustomerInfo }>} A promise of a customer info object. Rejections return an error code, and an
   * `userInfo` object with more information. The promise will be rejected if configure has not been called yet or if
   * there's an issue getting the customer information.
   */
  getCustomerInfo(): Promise<{ customerInfo: CustomerInfo }>;

  /**
   * This method will send all the purchases to the RevenueCat backend. Call this when using your own implementation
   * for subscriptions anytime a sync is needed, like after a successful purchase.
   *
   * @warning This function should only be called if you're not calling `purchaseProduct`/`purchaseStoreProduct`/`purchasePackage`/`purchaseSubscriptionOption`.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or if there's an error
   * syncing purchases.
   */
  syncPurchases(): Promise<void>;

  /**
   * @deprecated - Use {@link syncAmazonPurchase} instead
   * This method will send a purchase to the RevenueCat backend. This function should only be called if you are
   * in Amazon observer mode or performing a client side migration of your current users to RevenueCat.
   *
   * The receipt IDs are cached if successfully posted, so they are not posted more than once.
   *
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or if there's an error
   * syncing purchases.
   */
  syncObserverModeAmazonPurchase(options: SyncObserverModeAmazonPurchaseOptions): Promise<void>;

  /**
   * This method will send a purchase to the RevenueCat backend. This function should only be called if you are
   * in Amazon observer mode or performing a client side migration of your current users to RevenueCat.
   *
   * The receipt IDs are cached if successfully posted, so they are not posted more than once.
   *
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or if there's an error
   * syncing purchases.
   */
  syncAmazonPurchase(options: SyncAmazonPurchaseOptions): Promise<void>;

  /**
   * Supported in iOS 14.3+ only  
   * Enable automatic collection of Apple Search Ad attribution on iOS.  
   * Disabled by default.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet.
   */
  enableAdServicesAttributionTokenCollection(): Promise<void>;

  /**
   * @returns { Promise<boolean> } If the `appUserID` has been generated by RevenueCat or not.
   * The promise will be rejected if configure has not been called yet.
   */
  isAnonymous(): Promise<{ isAnonymous: boolean }>;

  /**
   * iOS only.  
   * Computes whether a user is eligible for the introductory pricing period of a given product.
   * You should use this method to determine whether you show the user the normal product price or the
   * introductory price. This also applies to trials (trials are considered a type of introductory pricing).
   *
   * @note Subscription groups are automatically collected for determining eligibility. If RevenueCat can't
   * definitively compute the eligibility, most likely because of missing group information, it will return
   * `INTRO_ELIGIBILITY_STATUS_UNKNOWN`. The best course of action on unknown status is to display the non-intro
   * pricing, to not create a misleading situation. To avoid this, make sure you are testing with the latest version of
   * iOS so that the subscription group can be collected by the SDK. Android always returns `INTRO_ELIGIBILITY_STATUS_UNKNOWN`.
   *
   * @param options Array of product identifiers for which you want to compute eligibility
   * @returns { Promise<[productId: string]: IntroEligibility> } A map of `IntroEligibility` per `productId`. The promise
   * will be rejected if configure has not been called yet or if there's in an error checking eligibility.
   */
  checkTrialOrIntroductoryPriceEligibility(options: {
    productIdentifiers: string[];
  }): Promise<{ [productId: string]: IntroEligibility }>;

  /**
   * iOS only.  
   * Use this function to retrieve the `PurchasesPromotionalOffer` for a given `PurchasesPackage`.
   *
   * @returns { Promise<PurchasesPromotionalOffer | undefined> } Returns when the `PurchasesPaymentDiscount` is returned.
   * Null is returned for Android and incompatible iOS versions. The promise will be rejected if configure has not been
   * called yet or if there's an error getting the payment discount.
   */
  getPromotionalOffer(options: GetPromotionalOfferOptions): Promise<PurchasesPromotionalOffer | undefined>;

  /**
   * iOS only, requires iOS 18.0 or greater with StoreKit 2. Use this function to retrieve
   * the eligible `PurchasesWinBackOffer`s that a subscriber is eligible for for a
   * given `PurchasesStoreProduct`.
   *
   * @returns { Promise<{ eligibleWinBackOffers: PurchasesWinBackOffer[] }> } A dictionary containing an array of `PurchasesWinBackOffer`s that
   * the subscriber is eligible for for the given `PurchasesStoreProduct`.
   * The promise will be rejected if called on an unsupported platform (Android or iOS < 18), or if called on iOS 18+ with StoreKit 1.
   * The promise will also be rejected if configure has not been called yet.
   */
  getEligibleWinBackOffersForProduct(options: GetEligibleWinBackOffersForProductOptions): Promise<{
    eligibleWinBackOffers: PurchasesWinBackOffer[];
  }>;

  /**
   * iOS only, requires iOS 18.0 or greater with StoreKit 2. Use this function to retrieve
   * the eligible `PurchasesWinBackOffer`s that a subscriber is eligible for for a
   * given `PurchasesStorePackage`.
   *
   * @returns { Promise<{ eligibleWinBackOffers: PurchasesWinBackOffer[] }> } An array of `PurchasesWinBackOffer`s that
   * the subscriber is eligible for for the given `PurchasesStorePackage`.
   * The promise will be rejected if called on an unsupported platform (Android or iOS < 18), or if called on iOS 18+ with StoreKit 1.
   * The promise will also be rejected if configure has not been called yet.
   */
  getEligibleWinBackOffersForPackage(options: GetEligibleWinBackOffersForPackageOptions): Promise<{
    eligibleWinBackOffers: PurchasesWinBackOffer[];
  }>;

  /**
   * iOS only, requires iOS 18.0 or greater with StoreKit 2. Purchase a product applying a given win-back offer.
   *
   * @returns {Promise<MakePurchaseResult>} A promise of an object containing
   * a customer info object, a transaction, and a product identifier. Rejections return an error code, a boolean indicating if the
   * user cancelled the purchase, and an object with more information. The promise will be also be rejected if configure
   * has not been called yet or if called in an unsupported platform (Android or iOS < 18), or if called on iOS 18+ with StoreKit 1.
   */
  purchaseProductWithWinBackOffer(
    options: PurchaseProductWithWinBackOfferOptions,
  ): Promise<MakePurchaseResult | undefined>;

  /**
   * iOS only, requires iOS 18.0 or greater with StoreKit 2. Purchase a package applying a given win-back offer.
   *
   * @returns {Promise<MakePurchaseResult>} A promise of an object containing
   * a customer info object, a transaction, and a product identifier. Rejections return an error code, a boolean indicating if the
   * user cancelled the purchase, and an object with more information. The promise will be also be rejected if configure
   * has not been called yet or if called in an unsupported platform (Android or iOS < 18), or if called on iOS 18+ with StoreKit 1.
   */
  purchasePackageWithWinBackOffer(
    options: PurchasePackageWithWinBackOfferOptions,
  ): Promise<MakePurchaseResult | undefined>;

  /**
   * Invalidates the cache for customer information.
   *
   * Most apps will not need to use this method; invalidating the cache can leave your app in an invalid state.
   * Refer to https://docs.revenuecat.com/docs/customer-info#section-get-user-information for more information on
   * using the cache properly.
   *
   * This is useful for cases where customer information might have been updated outside the app, like if a
   * promotional subscription is granted through the RevenueCat dashboard.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or there's an error
   * invalidating the customer info cache.
   */
  invalidateCustomerInfoCache(): Promise<void>;

  /** iOS 14.0+ only.  
   * Presents a code redemption sheet, useful for redeeming offer codes
   * Refer to https://docs.revenuecat.com/docs/ios-subscription-offers#offer-codes for more information on how
   * to configure and use offer codes
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or there's an error
   * presenting the code redemption sheet.
   */
  presentCodeRedemptionSheet(): Promise<void>;

  /**
   * Subscriber attributes are useful for storing additional, structured information on a user.
   * Since attributes are writable using a public key they should not be used for
   * managing secure or sensitive information such as subscription status, coins, etc.
   *
   * Key names starting with "$" are reserved names used by RevenueCat. For a full list of key
   * restrictions refer to our guide: https://docs.revenuecat.com/docs/subscriber-attributes
   *
   * @param attributes Map of attributes by key. Set the value as an empty string or null to delete an attribute.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or there's an error
   * setting the subscriber attributes.
   */
  setAttributes(attributes: { [key: string]: string | null }): Promise<void>;

  /**
   * Subscriber attribute associated with the email address for the user
   *
   * @param options Empty String or null will delete the subscriber attribute.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or if there's an error
   * setting the email.
   */
  setEmail(options: { email: string | null }): Promise<void>;

  /**
   * Subscriber attribute associated with the phone number for the user
   *
   * @param options Empty String or null will delete the subscriber attribute.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or if there's an error
   * setting the phone number.
   */
  setPhoneNumber(options: { phoneNumber: string | null }): Promise<void>;

  /**
   * Subscriber attribute associated with the display name for the user
   *
   * @param options Empty String or null will delete the subscriber attribute.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or if there's an error
   * setting the display name.
   */
  setDisplayName(options: { displayName: string | null }): Promise<void>;

  /**
   * Subscriber attribute associated with the push token for the user
   *
   * @param options Empty string or null will delete the subscriber attribute.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or if there's an error
   * setting the push token.
   */
  setPushToken(options: { pushToken: string | null }): Promise<void>;

  /**
   * Set this property to your proxy URL before configuring Purchases *only* if you've received a proxy key value
   * from your RevenueCat contact.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or if there's an error
   * setting the proxy url.
   */
  setProxyURL(options: { url: string }): Promise<void>;

  /**
   * Automatically collect subscriber attributes associated with the device identifiers.  
   * `$idfa`, `$idfv`, `$ip` on iOS  
   * `$gpsAdId`, `$androidId`, `$ip` on Android
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or if there's an error
   * setting collecting the device identifiers.
   */
  collectDeviceIdentifiers(): Promise<void>;

  /**
   * Subscriber attribute associated with the Adjust ID for the user
   * Required for the RevenueCat Adjust integration
   *
   * @param options Adjust ID to use in Adjust integration. Empty String or null will delete the subscriber attribute.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or if there's an error
   * setting Adjust ID.
   */
  setAdjustID(options: { adjustID: string | null }): Promise<void>;

  /**
   * Subscriber attribute associated with the AppsFlyer ID for the user
   * Required for the RevenueCat AppsFlyer integration
   * @param options Appsflyer ID to use in Appsflyer integration. Empty String or null will delete the subscriber attribute.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or if there's an error
   * setting the Appsflyer ID.
   */
  setAppsflyerID(options: { appsflyerID: string | null }): Promise<void>;

  /**
   * Subscriber attribute associated with the Facebook SDK Anonymous ID for the user
   * Recommended for the RevenueCat Facebook integration
   *
   * @param options Facebook Anonymous ID to use in Mparticle integration. Empty String or null will delete the subscriber attribute.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or if there's an error
   * setting the Facebook Anonymous ID.
   */
  setFBAnonymousID(options: { fbAnonymousID: string | null }): Promise<void>;

  /**
   * Subscriber attribute associated with the mParticle ID for the user
   * Recommended for the RevenueCat mParticle integration
   *
   * @param options Mparticle ID to use in Mparticle integration. Empty String or null will delete the subscriber attribute.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or if there's an error
   * setting the Mparticle ID.
   */
  setMparticleID(options: { mparticleID: string | null }): Promise<void>;

  /**
   * Subscriber attribute associated with the CleverTap ID for the user
   * Required for the RevenueCat CleverTap integration
   *
   * @param options CleverTap user ID to use in CleverTap integration. Empty String or null will delete the subscriber attribute.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or if there's an error
   * setting the CleverTap ID.
   */
  setCleverTapID(options: { cleverTapID: string | null }): Promise<void>;

  /**
   * Subscriber attribute associated with the Mixpanel Distinct ID for the user
   * Required for the RevenueCat Mixpanel integration
   *
   * @param options Mixpanel Distinct ID to use in Mixpanel integration. Empty String or null will delete the subscriber attribute.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or if there's an error
   * setting the Mixpanel Distinct ID.
   */
  setMixpanelDistinctID(options: { mixpanelDistinctID: string | null }): Promise<void>;

  /**
   * Subscriber attribute associated with the Firebase App Instance ID for the user
   * Required for the RevenueCat Firebase integration
   *
   * @param options Firebase App Instance ID to use in Firebase integration. Empty String or null will delete the subscriber attribute.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or if there's an error
   * setting the Firebase App Instance ID.
   */
  setFirebaseAppInstanceID(options: { firebaseAppInstanceID: string | null }): Promise<void>;

  /**
   * Deprecated for OneSignal versions above v9.0.  
   * Subscriber attribute associated with the OneSignal Player ID for the user
   * Required for the RevenueCat OneSignal integration. 
   *
   * @param options OneSignal Player ID to use in OneSignal integration. Empty String or null will delete the subscriber attribute.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or if there's an error
   * setting the OneSignal ID.
   */
  setOnesignalID(options: { onesignalID: string | null }): Promise<void>;

  /**
   * Subscriber attribute associated with the OneSignal User ID for the user
   * Required for the RevenueCat OneSignal integration with versions v11.0 and above.
   *
   * @param options OneSignal UserId to use in OneSignal integration. Empty String or null will delete the subscriber attribute.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or if there's an error
   * setting the OneSignal user ID.
   */
  setOnesignalUserID(options: { onesignalUserID: string | null }): Promise<void>;

  /**
   * Subscriber attribute associated with the Airship Channel ID for the user
   * Required for the RevenueCat Airship integration
   *
   * @param options Airship Channel ID to use in Airship integration. Empty String or null will delete the subscriber attribute.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or if there's an error
   * setting the Airship Channel ID.
   */
  setAirshipChannelID(options: { airshipChannelID: string | null }): Promise<void>;

  /**
   * Subscriber attribute associated with the install media source for the user
   *
   * @param options Empty String or null will delete the subscriber attribute.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or if there's an error
   * setting the media source.
   */
  setMediaSource(options: { mediaSource: string | null }): Promise<void>;

  /**
   * Subscriber attribute associated with the install campaign for the user
   *
   * @param options Empty String or null will delete the subscriber attribute.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or if there's an error
   * setting the campaign.
   */
  setCampaign(options: { campaign: string | null }): Promise<void>;

  /**
   * Subscriber attribute associated with the install ad group for the user
   *
   * @param options Empty String or null will delete the subscriber attribute.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or if there's an error
   * setting ad group.
   */
  setAdGroup(options: { adGroup: string | null }): Promise<void>;

  /**
   * Subscriber attribute associated with the install ad for the user
   *
   * @param options Empty String or null will delete the subscriber attribute.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or if there's an error
   * setting the ad subscriber attribute.
   */
  setAd(options: { ad: string | null }): Promise<void>;

  /**
   * Subscriber attribute associated with the install keyword for the user
   *
   * @param options Empty String or null will delete the subscriber attribute.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or if there's an error
   * setting the keyword.
   */
  setKeyword(options: { keyword: string | null }): Promise<void>;

  /**
   * Subscriber attribute associated with the install ad creative for the user
   *
   * @param options Empty String or null will delete the subscriber attribute.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet or if there's an error
   * setting the creative subscriber attribute.
   */
  setCreative(options: { creative: string | null }): Promise<void>;

  /**
   * Check if billing is supported for the current user (meaning IN-APP purchases are supported)
   * and optionally, whether a list of specified feature types are supported.
   *
   * Note: Billing features are only relevant to Google Play Android users.
   * For other stores and platforms, billing features won't be checked.
   *
   * @param options An array of feature types to check for support. Feature types must be one of
   *       [BILLING_FEATURE]. By default, is an empty list and no specific feature support will be checked.
   * @returns promise with boolean response. True if billing is supported, false otherwise.
   */
  canMakePayments(options?: { features?: BILLING_FEATURE[] }): Promise<{ canMakePayments: boolean }>;

  /**
   * iOS 15+ only.  
   * Presents a refund request sheet in the current window scene for
   * the latest transaction associated with the active entitlement.
   *
   * If the request was unsuccessful, no active entitlements could be found for
   * the user, or multiple active entitlements were found for the user,
   * the promise will return an error.
   * If called in an unsupported platform (Android or iOS < 15), an `UnsupportedPlatformException` will be thrown.
   *
   * Important: This method should only be used if your user can only have a single active entitlement at a given time.
   * If a user could have more than one entitlement at a time, use `beginRefundRequestForEntitlement` instead.
   *
   * @returns Returns `refundRequestStatus` - The status of the
   *  refund request. Keep in mind the status could be `REFUND_REQUEST_STATUS.USER_CANCELLED`
   */
  beginRefundRequestForActiveEntitlement(): Promise<{
    refundRequestStatus: REFUND_REQUEST_STATUS;
  }>;

  /**
   * iOS 15+ only.  
   * Presents a refund request sheet in the current window scene for
   * the latest transaction associated with the `entitlement`.
   *
   * If the request was unsuccessful, the promise will return an error.
   * If called in an unsupported platform (Android or iOS < 15), an `UnsupportedPlatformException` will be thrown.
   *
   * @param options The entitlement to begin a refund request for.
   * @returns Returns `refundRequestStatus` - The status of the
   *  refund request. Keep in mind the status could be `REFUND_REQUEST_STATUS.USER_CANCELLED`
   */
  beginRefundRequestForEntitlement(options: {
    entitlementInfo: PurchasesEntitlementInfo;
  }): Promise<{ refundRequestStatus: REFUND_REQUEST_STATUS }>;

  /**
   * iOS 15+ only.  
   * Presents a refund request sheet in the current window scene for
   * the latest transaction associated with the `product`.
   *
   * If the request was unsuccessful, the promise will return an error.
   * If called in an unsupported platform (Android or iOS < 15), an `UnsupportedPlatformException` will be thrown.
   *
   * @param options The StoreProduct to begin a refund request for.
   * @returns {Promise<REFUND_REQUEST_STATUS>} Returns `refundRequestStatus` -  The status of the
   *  refund request. Keep in mind the status could be `REFUND_REQUEST_STATUS.USER_CANCELLED`
   */
  beginRefundRequestForProduct(options: {
    storeProduct: PurchasesStoreProduct;
  }): Promise<{ refundRequestStatus: REFUND_REQUEST_STATUS }>;

  /**
   * Shows in-app messages available from the App Store or Google Play. You need to disable messages from showing
   * automatically using `[PurchasesConfiguration.shouldShowInAppMessagesAutomatically]`.
   *
   * Note: In iOS, this requires version 16+. In older versions the promise will be resolved successfully
   * immediately.
   *
   * @param options An array of message types that the stores can display inside your app. Values must be one of
   *       `[IN_APP_MESSAGE_TYPE]`. By default, is undefined and all message types will be shown.
   * @returns {Promise<void>} The promise will be rejected if configure has not been called yet.
   */
  showInAppMessages(options?: { messageTypes?: IN_APP_MESSAGE_TYPE[] }): Promise<void>;

  /**
   * Check if configure has finished and Purchases has been configured.
   *
   * @returns promise with boolean response
   */
  isConfigured(): Promise<{ isConfigured: boolean }>;
}

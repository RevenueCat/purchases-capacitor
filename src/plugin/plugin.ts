const PLUGIN_NAME = "PurchasesPlugin";

declare global {
  interface Window {
    cordova: any;
    plugins: any;
  }
}

export enum ATTRIBUTION_NETWORK {
  APPLE_SEARCH_ADS = 0,
  ADJUST = 1,
  APPSFLYER = 2,
  BRANCH = 3,
  TENJIN = 4,
  FACEBOOK = 5,
}

export enum PURCHASE_TYPE {
  /**
   * A type of SKU for in-app products.
   */
  INAPP = "inapp",

  /**
   * A type of SKU for subscriptions.
   */
  SUBS = "subs",
}

export enum PRORATION_MODE {
  UNKNOWN_SUBSCRIPTION_UPGRADE_DOWNGRADE_POLICY = 0,

  /**
   * Replacement takes effect immediately, and the remaining time will be
   * prorated and credited to the user. This is the current default behavior.
   */
  IMMEDIATE_WITH_TIME_PRORATION = 1,

  /**
   * Replacement takes effect immediately, and the billing cycle remains the
   * same. The price for the remaining period will be charged. This option is
   * only available for subscription upgrade.
   */
  IMMEDIATE_AND_CHARGE_PRORATED_PRICE = 2,

  /**
   * Replacement takes effect immediately, and the new price will be charged on
   * next recurrence time. The billing cycle stays the same.
   */
  IMMEDIATE_WITHOUT_PRORATION = 3,

  /**
   * Replacement takes effect when the old plan expires, and the new price will
   * be charged at the same time.
   */
  DEFERRED = 4,
}

export enum PACKAGE_TYPE {

  /**
   * A package that was defined with a custom identifier.
   */
  UNKNOWN = "UNKNOWN",

  /**
   * A package that was defined with a custom identifier.
   */
  CUSTOM = "CUSTOM",

  /**
   * A package configured with the predefined lifetime identifier.
   */
  LIFETIME = "LIFETIME",

  /**
   * A package configured with the predefined annual identifier.
   */
  ANNUAL = "ANNUAL",

  /**
   * A package configured with the predefined six month identifier.
   */
  SIX_MONTH = "SIX_MONTH",

  /**
   * A package configured with the predefined three month identifier.
   */
  THREE_MONTH = "THREE_MONTH",

  /**
   * A package configured with the predefined two month identifier.
   */
  TWO_MONTH = "TWO_MONTH",

  /**
   * A package configured with the predefined monthly identifier.
   */
  MONTHLY = "MONTHLY",

  /**
   * A package configured with the predefined weekly identifier.
   */
  WEEKLY = "WEEKLY",
}

export enum INTRO_ELIGIBILITY_STATUS {
  /**
   * RevenueCat doesn't have enough information to determine eligibility.
   */
  INTRO_ELIGIBILITY_STATUS_UNKNOWN = 0,
  /**
   * The user is not eligible for a free trial or intro pricing for this product.
   */
  INTRO_ELIGIBILITY_STATUS_INELIGIBLE,
  /**
   * The user is eligible for a free trial or intro pricing for this product.
   */
  INTRO_ELIGIBILITY_STATUS_ELIGIBLE
}

/**
 * The EntitlementInfo object gives you access to all of the information about the status of a user entitlement.
 */
export interface PurchasesEntitlementInfo {
  /**
   * The entitlement identifier configured in the RevenueCat dashboard
   */
  readonly identifier: string;
  /**
   * True if the user has access to this entitlement
   */
  readonly isActive: boolean;
  /**
   * True if the underlying subscription is set to renew at the end of the billing period (expirationDate).
   * Will always be True if entitlement is for lifetime access.
   */
  readonly willRenew: boolean;
  /**
   * The last period type this entitlement was in. Either: NORMAL, INTRO, TRIAL.
   */
  readonly periodType: string;
  /**
   * The latest purchase or renewal date for the entitlement.
   */
  readonly latestPurchaseDate: string;
  /**
   * The first date this entitlement was purchased.
   */
  readonly originalPurchaseDate: string;
  /**
   * The expiration date for the entitlement, can be `null` for lifetime access. If the `periodType` is `trial`,
   * this is the trial expiration date.
   */
  readonly expirationDate: string | null;
  /**
   * The store where this entitlement was unlocked from. Either: appStore, macAppStore, playStore, stripe,
   * promotional, unknownStore
   */
  readonly store: string;
  /**
   * The product identifier that unlocked this entitlement
   */
  readonly productIdentifier: string;
  /**
   * False if this entitlement is unlocked via a production purchase
   */
  readonly isSandbox: boolean;
  /**
   * The date an unsubscribe was detected. Can be `null`.
   *
   * @note: Entitlement may still be active even if user has unsubscribed. Check the `isActive` property.
   */
  readonly unsubscribeDetectedAt: string | null;
  /**
   * The date a billing issue was detected. Can be `null` if there is no billing issue or an issue has been resolved
   *
   * @note: Entitlement may still be active even if there is a billing issue. Check the `isActive` property.
   */
  readonly billingIssueDetectedAt: string | null;
}

/**
 * Contains all the entitlements associated to the user.
 */
export interface PurchasesEntitlementInfos {
  /**
   * Map of all EntitlementInfo (`PurchasesEntitlementInfo`) objects (active and inactive) keyed by entitlement identifier.
   */
  readonly all: { [key: string]: PurchasesEntitlementInfo };
  /**
   * Map of active EntitlementInfo (`PurchasesEntitlementInfo`) objects keyed by entitlement identifier.
   */
  readonly active: { [key: string]: PurchasesEntitlementInfo };
}

export interface PurchaserInfo {
  /**
   * Entitlements attached to this purchaser info
   */
  readonly entitlements: PurchasesEntitlementInfos;
  /**
   * Set of active subscription skus
   */
  readonly activeSubscriptions: [string];
  /**
   * Set of purchased skus, active and inactive
   */
  readonly allPurchasedProductIdentifiers: [string];
  /**
   * The latest expiration date of all purchased skus
   */
  readonly latestExpirationDate: string | null;
  /**
   * The date this user was first seen in RevenueCat.
   */
  readonly firstSeen: string;
  /**
   * The original App User Id recorded for this user.
   */
  readonly originalAppUserId: string;
  /**
   * Date when this info was requested
   */
  readonly requestDate: string;
  /**
   * Map of skus to expiration dates
   */
  readonly allExpirationDates: { [key: string]: string | null };
  /**
   * Map of skus to purchase dates
   */
  readonly allPurchaseDates: { [key: string]: string | null };
  /**
   * Returns the version number for the version of the application when the
   * user bought the app. Use this for grandfathering users when migrating
   * to subscriptions.
   *
   * This corresponds to the value of CFBundleVersion (in iOS) in the
   * Info.plist file when the purchase was originally made. This is always null
   * in Android
   */
  readonly originalApplicationVersion: string | null;
  /**
   * Returns the purchase date for the version of the application when the user bought the app.
   * Use this for grandfathering users when migrating to subscriptions.
   */
  readonly originalPurchaseDate: string | null;
  /**
   * URL to manage the active subscription of the user. If this user has an active iOS
   * subscription, this will point to the App Store, if the user has an active Play Store subscription
   * it will point there. If there are no active subscriptions it will be null.
   * If there are multiple for different platforms, it will point to the device store.
   */
  readonly managementURL: string | null;
}

export interface PurchasesProduct {
  /**
   * Product Id.
   */
  readonly identifier: string;
  /**
   * Description of the product.
   */
  readonly description: string;
  /**
   * Title of the product.
   */
  readonly title: string;
  /**
   * Price of the product in the local currency.
   */
  readonly price: number;
  /**
   * Formatted price of the item, including its currency sign, such as €3.99.
   */
  readonly price_string: string;
  /**
   * Currency code for price and original price.
   */
  readonly currency_code: string;
  /**
   * Introductory price of a subscription in the local currency.
   */
  readonly intro_price: number | null;
  /**
   * Formatted introductory price of a subscription, including its currency sign, such as €3.99.
   */
  readonly intro_price_string: string | null;
  /**
   * Billing period of the introductory price, specified in ISO 8601 format.
   */
  readonly intro_price_period: string | null;
  /**
   * Number of subscription billing periods for which the user will be given the introductory price, such as 3.
   */
  readonly intro_price_cycles: number | null;
  /**
   * Unit for the billing period of the introductory price, can be DAY, WEEK, MONTH or YEAR.
   */
  readonly intro_price_period_unit: string | null;
  /**
   * Number of units for the billing period of the introductory price.
   */
  readonly intro_price_period_number_of_units: number | null;
}

/**
 * Contains information about the product available for the user to purchase.
 * For more info see https://docs.revenuecat.com/docs/entitlements
 */
export interface PurchasesPackage {
  /**
   * Unique identifier for this package. Can be one a predefined package type or a custom one.
   */
  readonly identifier: string;
  /**
   * Package type for the product. Will be one of [PACKAGE_TYPE].
   */
  readonly packageType: PACKAGE_TYPE;
  /**
   * Product assigned to this package.
   */
  readonly product: PurchasesProduct;
  /**
   * Offering this package belongs to.
   */
  readonly offeringIdentifier: string;
}

/**
 * An offering is a collection of Packages (`PurchasesPackage`) available for the user to purchase.
 * For more info see https://docs.revenuecat.com/docs/entitlements
 */
export interface PurchasesOffering {
  /**
   * Unique identifier defined in RevenueCat dashboard.
   */
  readonly identifier: string;
  /**
   * Offering description defined in RevenueCat dashboard.
   */
  readonly serverDescription: string;
  /**
   * Array of `Package` objects available for purchase.
   */
  readonly availablePackages: [PurchasesPackage];
  /**
   * Lifetime package type configured in the RevenueCat dashboard, if available.
   */
  readonly lifetime: PurchasesPackage | null;
  /**
   * Annual package type configured in the RevenueCat dashboard, if available.
   */
  readonly annual: PurchasesPackage | null;
  /**
   * Six month package type configured in the RevenueCat dashboard, if available.
   */
  readonly sixMonth: PurchasesPackage | null;
  /**
   * Three month package type configured in the RevenueCat dashboard, if available.
   */
  readonly threeMonth: PurchasesPackage | null;
  /**
   * Two month package type configured in the RevenueCat dashboard, if available.
   */
  readonly twoMonth: PurchasesPackage | null;
  /**
   * Monthly package type configured in the RevenueCat dashboard, if available.
   */
  readonly monthly: PurchasesPackage | null;
  /**
   * Weekly package type configured in the RevenueCat dashboard, if available.
   */
  readonly weekly: PurchasesPackage | null;
}

/**
 * Contains all the offerings configured in RevenueCat dashboard.
 * For more info see https://docs.revenuecat.com/docs/entitlements
 */
export interface PurchasesOfferings {
  /**
   * Map of all Offerings [PurchasesOffering] objects keyed by their identifier.
   */
  readonly all: { [key: string]: PurchasesOffering };
  /**
   * Current offering configured in the RevenueCat dashboard.
   */
  readonly current: PurchasesOffering | null;
}

export interface PurchasesError {
  code: number;
  message: string;
  readableErrorCode: string;
  underlyingErrorMessage?: string;
}

/**
 * Holds the information used when upgrading from another sku. For Android use only.
 */
export interface UpgradeInfo {
  /**
   * The oldSKU to upgrade from.
   */
  readonly oldSKU: string;
  /**
   * The [PRORATION_MODE] to use when upgrading the given oldSKU.
   */
  readonly prorationMode?: PRORATION_MODE;
}

/**
 * Holds the introductory price status
 */
export interface IntroEligibility {
  /**
   * The introductory price eligibility status
   */
  readonly status: INTRO_ELIGIBILITY_STATUS;
  /**
   * Description of the status
   */
  readonly description: string;
}

export type ShouldPurchasePromoProductListener = (deferredPurchase: () => void) => void;
let shouldPurchasePromoProductListeners: ShouldPurchasePromoProductListener[] = [];

class Purchases {

  /**
   * @deprecated use ATTRIBUTION_NETWORK instead
   *
   * Enum for attribution networks
   * @readonly
   * @enum {Number}
   */
  public static ATTRIBUTION_NETWORKS = ATTRIBUTION_NETWORK;
  /**
   * Enum for attribution networks
   * @readonly
   * @enum {Number}
   */
  public static ATTRIBUTION_NETWORK = ATTRIBUTION_NETWORK;

  /**
   * Supported SKU types.
   * @readonly
   * @enum {string}
   */
  public static PURCHASE_TYPE = PURCHASE_TYPE;

  /**
   * Replace SKU's ProrationMode.
   * @readonly
   * @enum {number}
   */
  public static PRORATION_MODE = PRORATION_MODE;

  /**
   * Enumeration of all possible Package types.
   * @readonly
   * @enum {string}
   */
  public static PACKAGE_TYPE = PACKAGE_TYPE;

  /**
   * Enum of different possible states for intro price eligibility status.
   * @readonly
   * @enum {number}
   */
  public static INTRO_ELIGIBILITY_STATUS = INTRO_ELIGIBILITY_STATUS;

  /**
   * Sets up Purchases with your API key and an app user id.
   * @param {string} apiKey RevenueCat API Key. Needs to be a string
   * @param {string?} appUserID A unique id for identifying the user
   * @param {boolean} observerMode An optional boolean. Set this to TRUE if you have your own IAP implementation and
   * want to use only RevenueCat's backend. Default is FALSE. If you are on Android and setting this to ON, you will have
   * to acknowledge the purchases yourself.
   * @param {string?} userDefaultsSuiteName An optional string. iOS-only, will be ignored for Android. 
   * Set this if you would like the RevenueCat SDK to store its preferences in a different NSUserDefaults 
   * suite, otherwise it will use standardUserDefaults. Default is null, which will make the SDK use standardUserDefaults.
   */
  public static setup(
    apiKey: string,
    appUserID?: string | null,
    observerMode: boolean = false,
    userDefaultsSuiteName?: string
  ) {
    window.cordova.exec(
      (purchaserInfo: any) => {
        window.cordova.fireWindowEvent("onPurchaserInfoUpdated", purchaserInfo);
      },
      null,
      PLUGIN_NAME,
      "setupPurchases",
      [apiKey, appUserID, observerMode, userDefaultsSuiteName]
    );
    this.setupShouldPurchasePromoProductCallback();
  }

  /**
   * Set this to true if you are passing in an appUserID but it is anonymous, this is true by default if you didn't pass an appUserID
   * If a user tries to purchase a product that is active on the current app store account, we will treat it as a restore and alias
   * the new ID with the previous id.
   * @param {boolean} allowSharing true if enabled, false to disabled
   */
  public static setAllowSharingStoreAccount(allowSharing: boolean) {
    window.cordova.exec(
      null,
      null,
      PLUGIN_NAME,
      "setAllowSharingStoreAccount",
      [allowSharing]
    );
  }

  /**
   * Add a dict of attribution information
   * @param {object} data Attribution data from any of the attribution networks in Purchases.ATTRIBUTION_NETWORKS
   * @param {ATTRIBUTION_NETWORK} network Which network, see Purchases.ATTRIBUTION_NETWORK
   * @param {string?} networkUserId An optional unique id for identifying the user. Needs to be a string.
   */
  public static addAttributionData(
    data: { [key: string]: any },
    network: ATTRIBUTION_NETWORK,
    networkUserId?: string
  ) {
    window.cordova.exec(null, null, PLUGIN_NAME, "addAttributionData", [
      data,
      network,
      networkUserId,
    ]);
  }

  /**
   * Gets the Offerings configured in the RevenueCat dashboard
   * @param {function(PurchasesOfferings):void} callback Callback triggered after a successful getOfferings call.
   * @param {function(PurchasesError):void} errorCallback Callback triggered after an error or when retrieving offerings.
   */
  public static getOfferings(
    callback: (offerings: PurchasesOfferings) => void,
    errorCallback: (error: PurchasesError) => void
  ) {
    window.cordova.exec(
      callback,
      errorCallback,
      PLUGIN_NAME,
      "getOfferings",
      []
    );
  }

  /**
   * Fetch the product info
   * @param {[string]} productIdentifiers Array of product identifiers
   * @param {function(PurchasesProduct[]):void} callback Callback triggered after a successful getProducts call. It will receive an array of product objects.
   * @param {function(PurchasesError):void} errorCallback Callback triggered after an error or when retrieving products
   * @param {PURCHASE_TYPE} type Optional type of products to fetch, can be inapp or subs. Subs by default
   */
  public static getProducts(
    productIdentifiers: string[],
    callback: (products: PurchasesProduct[]) => void,
    errorCallback: (error: PurchasesError) => void,
    type: PURCHASE_TYPE = PURCHASE_TYPE.SUBS
  ) {
    window.cordova.exec(
      callback,
      errorCallback,
      PLUGIN_NAME,
      "getProductInfo",
      [productIdentifiers, type]
    );
  }

  /**
   * Make a purchase
   *
   * @deprecated Use purchaseProduct instead.
   *
   * @param {string} productIdentifier The product identifier of the product you want to purchase.
   * @param {function(string, PurchaserInfo):void} callback Callback triggered after a successful purchase.
   * @param {function(PurchasesError, boolean):void} errorCallback Callback triggered after an error or when the user cancels the purchase.
   * If user cancelled, userCancelled will be true
   * @param {string?} oldSKU Optional sku you wish to upgrade from.
   * @param {PURCHASE_TYPE} type Optional type of product, can be inapp or subs. Subs by default
   */
  public static makePurchase(
    productIdentifier: string,
    callback: ({productIdentifier, purchaserInfo}: { productIdentifier: string; purchaserInfo: PurchaserInfo; }) => void,
    errorCallback: ({error, userCancelled}: { error: PurchasesError; userCancelled: boolean; }) => void,
    oldSKU?: string | null,
    type: PURCHASE_TYPE = PURCHASE_TYPE.SUBS
  ) {
    if (Array.isArray(oldSKU)) {
      throw new Error("Calling a deprecated method!");
    }
    if (oldSKU !== undefined && oldSKU !== null) {
      this.purchaseProduct(
        productIdentifier,
        callback,
        errorCallback,
        {oldSKU},
        type
      );
    } else {
      this.purchaseProduct(
        productIdentifier,
        callback,
        errorCallback,
        null,
        type
      );
    }
  }

  /**
   * Make a purchase
   *
   * @param {string} productIdentifier The product identifier of the product you want to purchase.
   * @param {function(string, PurchaserInfo):void} callback Callback triggered after a successful purchase.
   * @param {function(PurchasesError, boolean):void} errorCallback Callback triggered after an error or when the user cancels the purchase.
   * If user cancelled, userCancelled will be true
   * @param {UpgradeInfo} upgradeInfo Android only. Optional UpgradeInfo you wish to upgrade from containing the oldSKU
   * and the optional prorationMode.
   * @param {PURCHASE_TYPE} type Optional type of product, can be inapp or subs. Subs by default
   */
  public static purchaseProduct(
    productIdentifier: string,
    callback: ({productIdentifier, purchaserInfo,}: { productIdentifier: string; purchaserInfo: PurchaserInfo; }) => void,
    errorCallback: ({error, userCancelled,}: { error: PurchasesError; userCancelled: boolean; }) => void,
    upgradeInfo?: UpgradeInfo | null,
    type: PURCHASE_TYPE = PURCHASE_TYPE.SUBS
  ) {
    window.cordova.exec(
      callback,
      (response: { [key: string]: any }) => {
        const {userCancelled, ...error} = response;
        errorCallback({
          error: error as PurchasesError,
          userCancelled,
        });
      },
      PLUGIN_NAME,
      "purchaseProduct",
      [
        productIdentifier,
        upgradeInfo !== undefined && upgradeInfo !== null ? upgradeInfo.oldSKU : null,
        upgradeInfo !== undefined && upgradeInfo !== null
          ? upgradeInfo.prorationMode
          : null,
        type,
      ]
    );
  }

  /**
   * Make a purchase
   *
   * @param {PurchasesPackage} aPackage The Package you wish to purchase. You can get the Packages by calling getOfferings
   * @param {function(string, PurchaserInfo):void} callback Callback triggered after a successful purchase.
   * @param {function(PurchasesError, boolean):void} errorCallback Callback triggered after an error or when the user cancels the purchase.
   * If user cancelled, userCancelled will be true
   * @param {UpgradeInfo} upgradeInfo Android only. Optional UpgradeInfo you wish to upgrade from containing the oldSKU
   * and the optional prorationMode.
   */
  public static purchasePackage(
    aPackage: PurchasesPackage,
    callback: ({productIdentifier, purchaserInfo,}: { productIdentifier: string; purchaserInfo: PurchaserInfo; }) => void,
    errorCallback: ({error, userCancelled,}: { error: PurchasesError; userCancelled: boolean; }) => void,
    upgradeInfo?: UpgradeInfo | null
  ) {
    window.cordova.exec(
      callback,
      (response: { [key: string]: any }) => {
        const {userCancelled, ...error} = response;
        errorCallback({
          error: error as PurchasesError,
          userCancelled,
        });
      },
      PLUGIN_NAME,
      "purchasePackage",
      [
        aPackage.identifier,
        aPackage.offeringIdentifier,
        upgradeInfo !== undefined && upgradeInfo !== null
          ? upgradeInfo.oldSKU
          : null,
        upgradeInfo !== undefined && upgradeInfo !== null
          ? upgradeInfo.prorationMode
          : null,
      ]
    );
  }

  /**
   * Restores a user's previous purchases and links their appUserIDs to any user's also using those purchases.
   * @param {function(PurchaserInfo):void} callback Callback that will receive the new purchaser info after restoring transactions.
   * @param {function(PurchasesError):void} errorCallback Callback that will be triggered whenever there is any problem restoring the user transactions. This gets normally triggered if there
   * is an error retrieving the new purchaser info for the new user or the user cancelled the restore
   */
  public static restoreTransactions(
    callback: (purchaserInfo: PurchaserInfo) => void,
    errorCallback: (error: PurchasesError) => void
  ) {
    window.cordova.exec(
      callback,
      errorCallback,
      PLUGIN_NAME,
      "restoreTransactions",
      []
    );
  }

  /**
   * Get the appUserID that is currently in placed in the SDK
   * @param {function(string):void} callback Callback that will receive the current appUserID
   */
  public static getAppUserID(callback: (appUserID: string) => void) {
    window.cordova.exec(callback, null, PLUGIN_NAME, "getAppUserID", []);
  }

  /**
   * This function will alias two appUserIDs together.
   * @param {string} newAppUserID The new appUserID that should be linked to the currently identified appUserID. Needs to be a string.
   * @param {function(PurchaserInfo):void} callback Callback that will receive the new purchaser info after creating the alias
   * @param {function(PurchasesError):void} errorCallback Callback that will be triggered whenever there is any problem creating the alias. This gets normally triggered if there
   * is an error retrieving the new purchaser info for the new user or there is an error creating the alias.
   */
  public static createAlias(
    newAppUserID: string,
    callback: (purchaserInfo: PurchaserInfo) => void,
    errorCallback: (error: PurchasesError) => void
  ) {
    // noinspection SuspiciousTypeOfGuard
    if (typeof newAppUserID !== "string" || newAppUserID === "") {
      throw new Error("newAppUserID is a required string and cannot be empty");
    }
    window.cordova.exec(callback, errorCallback, PLUGIN_NAME, "createAlias", [
      newAppUserID,
    ]);
  }

  /**
   * This function will identify the current user with an appUserID. Typically this would be used after a logout to identify a new user without calling configure
   * @param {string} newAppUserID The appUserID that should be linked to the currently user
   * @param {function(PurchaserInfo):void} callback Callback that will receive the new purchaser info after identifying.
   * @param {function(PurchasesError, boolean):void} errorCallback Callback that will be triggered whenever there is any problem identifying the new user. This gets normally triggered if there
   * is an error retrieving the new purchaser info for the new user.
   */
  public static identify(
    newAppUserID: string,
    callback: (purchaserInfo: PurchaserInfo) => void,
    errorCallback: (error: PurchasesError) => void
  ) {
    // noinspection SuspiciousTypeOfGuard
    if (typeof newAppUserID !== "string" || newAppUserID === "") {
      throw new Error("newAppUserID is a required string and cannot be empty");
    }
    window.cordova.exec(callback, errorCallback, PLUGIN_NAME, "identify", [
      newAppUserID,
    ]);
  }

  /**
   * Resets the Purchases client clearing the saved appUserID. This will generate a random user id and save it in the cache.
   * @param {function(PurchaserInfo):void} callback Callback that will receive the new purchaser info after resetting
   * @param {function(PurchasesError, boolean):void} errorCallback Callback that will be triggered whenever there is any problem resetting the SDK. This gets normally triggered if there
   * is an error retrieving the new purchaser info for the new user.
   */
  public static reset(
    callback: (purchaserInfo: PurchaserInfo) => void,
    errorCallback: (error: PurchasesError) => void
  ) {
    window.cordova.exec(callback, errorCallback, PLUGIN_NAME, "reset", []);
  }

  /**
   * Gets the current purchaser info. This call will return the cached purchaser info unless the cache is stale, in which case,
   * it will make a network call to retrieve it from the servers.
   * @param {function(PurchaserInfo):void} callback Callback that will receive the purchaser info
   * @param {function(PurchasesError, boolean):void} errorCallback Callback that will be triggered whenever there is any problem retrieving the purchaser info
   */
  public static getPurchaserInfo(
    callback: (purchaserInfo: PurchaserInfo) => void,
    errorCallback: (error: PurchasesError) => void
  ) {
    window.cordova.exec(
      callback,
      errorCallback,
      PLUGIN_NAME,
      "getPurchaserInfo",
      []
    );
  }

  /**
   * Enables/Disables debugs logs
   * @param {Boolean} enabled Enable or not debug logs
   */
  public static setDebugLogsEnabled(enabled: boolean) {
    window.cordova.exec(null, null, PLUGIN_NAME, "setDebugLogsEnabled", [
      enabled,
    ]);
  }

  /**
   * This method will send all the purchases to the RevenueCat backend. Call this when using your own implementation
   * for subscriptions anytime a sync is needed, like after a successful purchase.
   *
   * @warning This function should only be called if you're not calling makePurchase.
   */
  public static syncPurchases() {
    window.cordova.exec(null, null, PLUGIN_NAME, "syncPurchases", []);
  }

  /**
   * Enable automatic collection of Apple Search Ads attribution. Disabled by default.
   *
   * @param {Boolean} enabled Enable or not automatic collection
   */
  public static setAutomaticAppleSearchAdsAttributionCollection(enabled: boolean) {
    window.cordova.exec(
      null,
      null,
      PLUGIN_NAME,
      "setAutomaticAppleSearchAdsAttributionCollection",
      [enabled]
    );
  }

  /**
   * @param {function(boolean):void} callback Will be sent a boolean indicating if the `appUserID` has been generated
   * by RevenueCat or not.
   */
  public static isAnonymous(callback: (isAnonymous: boolean) => void) {
    window.cordova.exec(callback, null, PLUGIN_NAME, "isAnonymous", []);
  }

  /**
   *  iOS only. Computes whether or not a user is eligible for the introductory pricing period of a given product.
   *  You should use this method to determine whether or not you show the user the normal product price or the
   *  introductory price. This also applies to trials (trials are considered a type of introductory pricing).
   *
   *  @note Subscription groups are automatically collected for determining eligibility. If RevenueCat can't
   *  definitively compute the eligibility, most likely because of missing group information, it will return
   *  `INTRO_ELIGIBILITY_STATUS_UNKNOWN`. The best course of action on unknown status is to display the non-intro
   *  pricing, to not create a misleading situation. To avoid this, make sure you are testing with the latest version of
   *  iOS so that the subscription group can be collected by the SDK. Android always returns INTRO_ELIGIBILITY_STATUS_UNKNOWN.
   *
   *  @param productIdentifiers Array of product identifiers for which you want to compute eligibility
   *  @param callback Will be sent a map of IntroEligibility per productId
   */
  public static checkTrialOrIntroductoryPriceEligibility(
    productIdentifiers: string[],
    callback: (map: { [productId:string]:IntroEligibility; }) => void
  ) {
    window.cordova.exec(callback, null, PLUGIN_NAME, "checkTrialOrIntroductoryPriceEligibility", [productIdentifiers]);
  }
  /**
   * Sets a function to be called on purchases initiated on the Apple App Store. This is only used in iOS.
   * @param {ShouldPurchasePromoProductListener} shouldPurchasePromoProductListener Called when a user initiates a
   * promotional in-app purchase from the App Store. If your app is able to handle a purchase at the current time, run
   * the deferredPurchase function. If the app is not in a state to make a purchase: cache the deferredPurchase, then
   * call the deferredPurchase when the app is ready to make the promotional purchase.
   * If the purchase should never be made, you don't need to ever call the deferredPurchase and the app will not
   * proceed with promotional purchases.
   */
  public static addShouldPurchasePromoProductListener(shouldPurchasePromoProductListener: ShouldPurchasePromoProductListener): void { 
    if (typeof shouldPurchasePromoProductListener !== "function") {
      throw new Error("addShouldPurchasePromoProductListener needs a function");
    }
    shouldPurchasePromoProductListeners.push(shouldPurchasePromoProductListener);
  }

  /**
   * Removes a given ShouldPurchasePromoProductListener
   * @param {ShouldPurchasePromoProductListener} listenerToRemove ShouldPurchasePromoProductListener reference of the listener to remove
   * @returns {boolean} True if listener was removed, false otherwise
   */
  public static removeShouldPurchasePromoProductListener(listenerToRemove: ShouldPurchasePromoProductListener): boolean { 
    if (shouldPurchasePromoProductListeners.indexOf(listenerToRemove) !== -1) {
      shouldPurchasePromoProductListeners = shouldPurchasePromoProductListeners.filter(
        listener => listenerToRemove !== listener
      );
      return true;
    }
    return false;
  }
  /**
   * Invalidates the cache for purchaser information.
   * 
   * Most apps will not need to use this method; invalidating the cache can leave your app in an invalid state.
   * Refer to https://docs.revenuecat.com/docs/purchaserinfo#section-get-user-information for more information on
   * using the cache properly.
   * 
   * This is useful for cases where purchaser information might have been updated outside of the
   * app, like if a promotional subscription is granted through the RevenueCat dashboard.
   */
  public static invalidatePurchaserInfoCache() {
    window.cordova.exec(
      null,
      null,
      PLUGIN_NAME,
      "invalidatePurchaserInfoCache",
      []
    );
  }

  /**
   * Subscriber attributes are useful for storing additional, structured information on a user.
   * Since attributes are writable using a public key they should not be used for
   * managing secure or sensitive information such as subscription status, coins, etc.
   *
   * Key names starting with "$" are reserved names used by RevenueCat. For a full list of key
   * restrictions refer to our guide: https://docs.revenuecat.com/docs/subscriber-attributes
   *
   * @param attributes Map of attributes by key. Set the value as an empty string to delete an attribute.
   */
  public static setAttributes(attributes: { [key: string]: string | null }) {
    window.cordova.exec(
      null,
      null,
      PLUGIN_NAME,
      "setAttributes",
      [attributes]
    );
  }
  
  /**
   * Subscriber attribute associated with the email address for the user
   *
   * @param email Empty String or null will delete the subscriber attribute.
   */
  public static setEmail(email: string | null) {
    window.cordova.exec(
      null,
      null,
      PLUGIN_NAME,
      "setEmail",
      [email]
    );
  }

  /**
   * Subscriber attribute associated with the phone number for the user
   *
   * @param phoneNumber Empty String or null will delete the subscriber attribute.
   */
  public static setPhoneNumber(phoneNumber: string | null) {
    window.cordova.exec(
      null,
      null,
      PLUGIN_NAME,
      "setPhoneNumber",
      [phoneNumber]
    );
  }

  /**
   * Subscriber attribute associated with the display name for the user
   *
   * @param displayName Empty String or null will delete the subscriber attribute.
   */
  public static setDisplayName(displayName: string | null) {
    window.cordova.exec(
      null,
      null,
      PLUGIN_NAME,
      "setDisplayName",
      [displayName]
    );
  }
  
  /**
   * Subscriber attribute associated with the push token for the user
   *
   * @param pushToken null will delete the subscriber attribute.
   */
  public static setPushToken(pushToken: string | null) {
    window.cordova.exec(
      null,
      null,
      PLUGIN_NAME,
      "setPushToken",
      [pushToken]
    );
  }
  
  /**
   * Set this property to your proxy URL before configuring Purchases *only* if you've received a proxy key value from your RevenueCat contact.
   * @param url Proxy URL as a string.
   */
  public static setProxyURL(url: string) {
    window.cordova.exec(
      null,
      null,
      PLUGIN_NAME,
      "setProxyURLString",
      [url]
    );
  }

  private static setupShouldPurchasePromoProductCallback() { 
    window.cordova.exec(
      ({callbackID}:{callbackID: number}) => {
          shouldPurchasePromoProductListeners.forEach(listener =>
            listener(this.getMakeDeferredPurchaseFunction(callbackID))
          );
      },
      null,
      PLUGIN_NAME,
      "setupShouldPurchasePromoProductCallback",
      []
    );
  }

  private static getMakeDeferredPurchaseFunction(callbackID: number) { 
    return () => window.cordova.exec(null, null, PLUGIN_NAME, "makeDeferredPurchase", [callbackID]);
  }
}

if (!window.plugins) {
  window.plugins = {};
}

if (!window.plugins.Purchases) {
  window.plugins.Purchases = new Purchases();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = Purchases;
}

export default Purchases;

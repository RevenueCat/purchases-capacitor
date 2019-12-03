declare global {
    interface Window {
        cordova: any;
        plugins: any;
    }
}
declare enum ATTRIBUTION_NETWORK {
    APPLE_SEARCH_ADS = 0,
    ADJUST = 1,
    APPSFLYER = 2,
    BRANCH = 3,
    TENJIN = 4,
    FACEBOOK = 5
}
declare enum PURCHASE_TYPE {
    /**
     * A type of SKU for in-app products.
     */
    INAPP = "inapp",
    /**
     * A type of SKU for subscriptions.
     */
    SUBS = "subs"
}
declare enum PRORATION_MODE {
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
    DEFERRED = 4
}
declare enum PACKAGE_TYPE {
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
    WEEKLY = "WEEKLY"
}
/**
 * The EntitlementInfo object gives you access to all of the information about the status of a user entitlement.
 */
interface PurchasesEntitlementInfo {
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
interface PurchasesEntitlementInfos {
    /**
     * Map of all EntitlementInfo (`PurchasesEntitlementInfo`) objects (active and inactive) keyed by entitlement identifier.
     */
    readonly all: {
        [key: string]: PurchasesEntitlementInfo;
    };
    /**
     * Map of active EntitlementInfo (`PurchasesEntitlementInfo`) objects keyed by entitlement identifier.
     */
    readonly active: {
        [key: string]: PurchasesEntitlementInfo;
    };
}
interface PurchaserInfo {
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
    readonly allExpirationDates: {
        [key: string]: string | null;
    };
    /**
     * Map of skus to purchase dates
     */
    readonly allPurchaseDates: {
        [key: string]: string | null;
    };
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
}
interface PurchasesProduct {
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
     * Formatted price of the item, including its currency sign.
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
interface PurchasesPackage {
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
interface PurchasesOffering {
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
interface PurchasesOfferings {
    /**
     * Map of all Offerings [PurchasesOffering] objects keyed by their identifier.
     */
    readonly all: {
        [key: string]: PurchasesOffering;
    };
    /**
     * Current offering configured in the RevenueCat dashboard.
     */
    readonly current: PurchasesOffering | null;
}
interface PurchasesError {
    code: number;
    message: string;
    readableErrorCode: string;
    underlyingErrorMessage: string;
}
/**
 * Holds the information used when upgrading from another sku. For Android use only.
 */
interface UpgradeInfo {
    /**
     * The oldSKU to upgrade from.
     */
    readonly oldSKU: string;
    /**
     * The [PRORATION_MODE] to use when upgrading the given oldSKU.
     */
    readonly prorationMode?: PRORATION_MODE;
}
declare class Purchases {
    /**
     * @deprecated use ATTRIBUTION_NETWORK instead
     *
     * Enum for attribution networks
     * @readonly
     * @enum {Number}
     */
    static ATTRIBUTION_NETWORKS: typeof ATTRIBUTION_NETWORK;
    /**
     * Enum for attribution networks
     * @readonly
     * @enum {Number}
     */
    static ATTRIBUTION_NETWORK: typeof ATTRIBUTION_NETWORK;
    /**
     * Supported SKU types.
     * @readonly
     * @enum {string}
     */
    static PURCHASE_TYPE: typeof PURCHASE_TYPE;
    /**
     * Replace SKU's ProrationMode.
     * @readonly
     * @enum {number}
     */
    static PRORATION_MODE: typeof PRORATION_MODE;
    /**
     * Enumeration of all possible Package types.
     * @readonly
     * @enum {string}
     */
    static PACKAGE_TYPE: typeof PACKAGE_TYPE;
    /**
     * Sets up Purchases with your API key and an app user id.
     * @param {string} apiKey RevenueCat API Key. Needs to be a string
     * @param {string?} appUserID A unique id for identifying the user
     * @param {boolean} observerMode An optional boolean. Set this to TRUE if you have your own IAP implementation and
     * want to use only RevenueCat's backend. Default is FALSE. If you are on Android and setting this to ON, you will have
     * to acknowledge the purchases yourself.
     */
    static setup(apiKey: string, appUserID?: string | null, observerMode?: boolean): void;
    /**
     * Set this to true if you are passing in an appUserID but it is anonymous, this is true by default if you didn't pass an appUserID
     * If a user tries to purchase a product that is active on the current app store account, we will treat it as a restore and alias
     * the new ID with the previous id.
     */
    static setAllowSharingStoreAccount(allowSharing: boolean): void;
    /**
     * Add a dict of attribution information
     * @param {object} data Attribution data from any of the attribution networks in Purchases.ATTRIBUTION_NETWORKS
     * @param {ATTRIBUTION_NETWORKS} network Which network, see Purchases.ATTRIBUTION_NETWORKS
     * @param {string?} networkUserId An optional unique id for identifying the user. Needs to be a string.
     */
    static addAttributionData(data: {
        [key: string]: any;
    }, network: ATTRIBUTION_NETWORK, networkUserId?: string): void;
    /**
     * Gets the map of entitlements -> offerings -> products
     * @param {function(PurchasesOfferings):void} callback Callback triggered after a successful getEntitlements call. It will receive an structure of entitlements.
     * @param {function(PurchasesError):void} errorCallback Callback triggered after an error or when retrieving entitlements.
     */
    static getOfferings(callback: (offerings: PurchasesOfferings) => void, errorCallback: (error: PurchasesError) => void): void;
    /**
     * Fetch the product info
     * @param {[string]} productIdentifiers Array of product identifiers
     * @param {function(PurchasesProduct[]):void} callback Callback triggered after a successful getProducts call. It will receive an array of product objects.
     * @param {function(PurchasesError):void} errorCallback Callback triggered after an error or when retrieving products
     * @param {PURCHASE_TYPE} type Optional type of products to fetch, can be inapp or subs. Subs by default
     */
    static getProducts(productIdentifiers: string[], callback: (products: PurchasesProduct[]) => void, errorCallback: (error: PurchasesError) => void, type?: PURCHASE_TYPE): void;
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
    static makePurchase(productIdentifier: string, callback: ({ productIdentifier, purchaserInfo }: {
        productIdentifier: string;
        purchaserInfo: PurchaserInfo;
    }) => void, errorCallback: ({ error, userCancelled }: {
        error: PurchasesError;
        userCancelled: boolean;
    }) => void, oldSKU?: string | null, type?: PURCHASE_TYPE): void;
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
    static purchaseProduct(productIdentifier: string, callback: ({ productIdentifier, purchaserInfo, }: {
        productIdentifier: string;
        purchaserInfo: PurchaserInfo;
    }) => void, errorCallback: ({ error, userCancelled, }: {
        error: PurchasesError;
        userCancelled: boolean;
    }) => void, upgradeInfo?: UpgradeInfo | null, type?: PURCHASE_TYPE): void;
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
    static purchasePackage(aPackage: PurchasesPackage, callback: ({ productIdentifier, purchaserInfo, }: {
        productIdentifier: string;
        purchaserInfo: PurchaserInfo;
    }) => void, errorCallback: ({ error, userCancelled, }: {
        error: PurchasesError;
        userCancelled: boolean;
    }) => void, upgradeInfo?: UpgradeInfo | null): void;
    /**
     * Restores a user's previous purchases and links their appUserIDs to any user's also using those purchases.
     * @param {function(PurchaserInfo):void} callback Callback that will receive the new purchaser info after restoring transactions.
     * @param {function(PurchasesError):void} errorCallback Callback that will be triggered whenever there is any problem restoring the user transactions. This gets normally triggered if there
     * is an error retrieving the new purchaser info for the new user or the user cancelled the restore
     */
    static restoreTransactions(callback: (purchaserInfo: PurchaserInfo) => void, errorCallback: (error: PurchasesError) => void): void;
    /**
     * Get the appUserID that is currently in placed in the SDK
     * @param {function(string):void} callback Callback that will receive the current appUserID
     */
    static getAppUserID(callback: (appUserID: string) => void): void;
    /**
     * This function will alias two appUserIDs together.
     * @param {string} newAppUserID The new appUserID that should be linked to the currently identified appUserID. Needs to be a string.
     * @param {function(PurchaserInfo):void} callback Callback that will receive the new purchaser info after creating the alias
     * @param {function(PurchasesError):void} errorCallback Callback that will be triggered whenever there is any problem creating the alias. This gets normally triggered if there
     * is an error retrieving the new purchaser info for the new user or there is an error creating the alias.
     */
    static createAlias(newAppUserID: string, callback: (purchaserInfo: PurchaserInfo) => void, errorCallback: (error: PurchasesError) => void): void;
    /**
     * This function will identify the current user with an appUserID. Typically this would be used after a logout to identify a new user without calling configure
     * @param {string} newAppUserID The appUserID that should be linked to the currently user
     * @param {function(PurchaserInfo):void} callback Callback that will receive the new purchaser info after identifying.
     * @param {function(PurchasesError, boolean):void} errorCallback Callback that will be triggered whenever there is any problem identifying the new user. This gets normally triggered if there
     * is an error retrieving the new purchaser info for the new user.
     */
    static identify(newAppUserID: string, callback: (purchaserInfo: PurchaserInfo) => void, errorCallback: (error: PurchasesError) => void): void;
    /**
     * Resets the Purchases client clearing the saved appUserID. This will generate a random user id and save it in the cache.
     * @param {function(PurchaserInfo):void} callback Callback that will receive the new purchaser info after resetting
     * @param {function(PurchasesError, boolean):void} errorCallback Callback that will be triggered whenever there is any problem resetting the SDK. This gets normally triggered if there
     * is an error retrieving the new purchaser info for the new user.
     */
    static reset(callback: (purchaserInfo: PurchaserInfo) => void, errorCallback: (error: PurchasesError) => void): void;
    /**
     * Gets the current purchaser info. This call will return the cached purchaser info unless the cache is stale, in which case,
     * it will make a network call to retrieve it from the servers.
     * @param {function(PurchaserInfo):void} callback Callback that will receive the purchaser info
     * @param {function(PurchasesError, boolean):void} errorCallback Callback that will be triggered whenever there is any problem retrieving the purchaser info
     */
    static getPurchaserInfo(callback: (purchaserInfo: PurchaserInfo) => void, errorCallback: (error: PurchasesError) => void): void;
    /**
     * Enables/Disables debugs logs
     * @param {Boolean} enabled Enable or not debug logs
     */
    static setDebugLogsEnabled(enabled: boolean): void;
    /**
     * This method will send all the purchases to the RevenueCat backend. Call this when using your own implementation
     * for subscriptions anytime a sync is needed, like after a successful purchase.
     *
     * @warning This function should only be called if you're not calling makePurchase.
     */
    static syncPurchases(): void;
    /**
     * Enable automatic collection of Apple Search Ads attribution. Disabled by default.
     *
     * @param {Boolean} enabled Enable or not automatic collection
     */
    static setAutomaticAppleSearchAdsAttributionCollection(enabled: boolean): void;
    /**
     * @param {function(boolean):void} callback Will be sent a boolean indicating if the `appUserID` has been generated
     * by RevenueCat or not.
     */
    static isAnonymous(callback: (isAnonymous: boolean) => void): void;
}
export default Purchases;

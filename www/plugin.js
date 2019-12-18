"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var PLUGIN_NAME = "PurchasesPlugin";
var ATTRIBUTION_NETWORK;
(function (ATTRIBUTION_NETWORK) {
    ATTRIBUTION_NETWORK[ATTRIBUTION_NETWORK["APPLE_SEARCH_ADS"] = 0] = "APPLE_SEARCH_ADS";
    ATTRIBUTION_NETWORK[ATTRIBUTION_NETWORK["ADJUST"] = 1] = "ADJUST";
    ATTRIBUTION_NETWORK[ATTRIBUTION_NETWORK["APPSFLYER"] = 2] = "APPSFLYER";
    ATTRIBUTION_NETWORK[ATTRIBUTION_NETWORK["BRANCH"] = 3] = "BRANCH";
    ATTRIBUTION_NETWORK[ATTRIBUTION_NETWORK["TENJIN"] = 4] = "TENJIN";
    ATTRIBUTION_NETWORK[ATTRIBUTION_NETWORK["FACEBOOK"] = 5] = "FACEBOOK";
})(ATTRIBUTION_NETWORK || (ATTRIBUTION_NETWORK = {}));
var PURCHASE_TYPE;
(function (PURCHASE_TYPE) {
    /**
     * A type of SKU for in-app products.
     */
    PURCHASE_TYPE["INAPP"] = "inapp";
    /**
     * A type of SKU for subscriptions.
     */
    PURCHASE_TYPE["SUBS"] = "subs";
})(PURCHASE_TYPE || (PURCHASE_TYPE = {}));
var PRORATION_MODE;
(function (PRORATION_MODE) {
    PRORATION_MODE[PRORATION_MODE["UNKNOWN_SUBSCRIPTION_UPGRADE_DOWNGRADE_POLICY"] = 0] = "UNKNOWN_SUBSCRIPTION_UPGRADE_DOWNGRADE_POLICY";
    /**
     * Replacement takes effect immediately, and the remaining time will be
     * prorated and credited to the user. This is the current default behavior.
     */
    PRORATION_MODE[PRORATION_MODE["IMMEDIATE_WITH_TIME_PRORATION"] = 1] = "IMMEDIATE_WITH_TIME_PRORATION";
    /**
     * Replacement takes effect immediately, and the billing cycle remains the
     * same. The price for the remaining period will be charged. This option is
     * only available for subscription upgrade.
     */
    PRORATION_MODE[PRORATION_MODE["IMMEDIATE_AND_CHARGE_PRORATED_PRICE"] = 2] = "IMMEDIATE_AND_CHARGE_PRORATED_PRICE";
    /**
     * Replacement takes effect immediately, and the new price will be charged on
     * next recurrence time. The billing cycle stays the same.
     */
    PRORATION_MODE[PRORATION_MODE["IMMEDIATE_WITHOUT_PRORATION"] = 3] = "IMMEDIATE_WITHOUT_PRORATION";
    /**
     * Replacement takes effect when the old plan expires, and the new price will
     * be charged at the same time.
     */
    PRORATION_MODE[PRORATION_MODE["DEFERRED"] = 4] = "DEFERRED";
})(PRORATION_MODE || (PRORATION_MODE = {}));
var PACKAGE_TYPE;
(function (PACKAGE_TYPE) {
    /**
     * A package that was defined with a custom identifier.
     */
    PACKAGE_TYPE["UNKNOWN"] = "UNKNOWN";
    /**
     * A package that was defined with a custom identifier.
     */
    PACKAGE_TYPE["CUSTOM"] = "CUSTOM";
    /**
     * A package configured with the predefined lifetime identifier.
     */
    PACKAGE_TYPE["LIFETIME"] = "LIFETIME";
    /**
     * A package configured with the predefined annual identifier.
     */
    PACKAGE_TYPE["ANNUAL"] = "ANNUAL";
    /**
     * A package configured with the predefined six month identifier.
     */
    PACKAGE_TYPE["SIX_MONTH"] = "SIX_MONTH";
    /**
     * A package configured with the predefined three month identifier.
     */
    PACKAGE_TYPE["THREE_MONTH"] = "THREE_MONTH";
    /**
     * A package configured with the predefined two month identifier.
     */
    PACKAGE_TYPE["TWO_MONTH"] = "TWO_MONTH";
    /**
     * A package configured with the predefined monthly identifier.
     */
    PACKAGE_TYPE["MONTHLY"] = "MONTHLY";
    /**
     * A package configured with the predefined weekly identifier.
     */
    PACKAGE_TYPE["WEEKLY"] = "WEEKLY";
})(PACKAGE_TYPE || (PACKAGE_TYPE = {}));
var INTRO_ELIGIBILITY_STATUS;
(function (INTRO_ELIGIBILITY_STATUS) {
    /**
     * RevenueCat doesn't have enough information to determine eligibility.
     */
    INTRO_ELIGIBILITY_STATUS[INTRO_ELIGIBILITY_STATUS["INTRO_ELIGIBILITY_STATUS_UNKNOWN"] = 0] = "INTRO_ELIGIBILITY_STATUS_UNKNOWN";
    /**
     * The user is not eligible for a free trial or intro pricing for this product.
     */
    INTRO_ELIGIBILITY_STATUS[INTRO_ELIGIBILITY_STATUS["INTRO_ELIGIBILITY_STATUS_INELIGIBLE"] = 1] = "INTRO_ELIGIBILITY_STATUS_INELIGIBLE";
    /**
     * The user is eligible for a free trial or intro pricing for this product.
     */
    INTRO_ELIGIBILITY_STATUS[INTRO_ELIGIBILITY_STATUS["INTRO_ELIGIBILITY_STATUS_ELIGIBLE"] = 2] = "INTRO_ELIGIBILITY_STATUS_ELIGIBLE";
})(INTRO_ELIGIBILITY_STATUS || (INTRO_ELIGIBILITY_STATUS = {}));
var Purchases = /** @class */ (function () {
    function Purchases() {
    }
    /**
     * Sets up Purchases with your API key and an app user id.
     * @param {string} apiKey RevenueCat API Key. Needs to be a string
     * @param {string?} appUserID A unique id for identifying the user
     * @param {boolean} observerMode An optional boolean. Set this to TRUE if you have your own IAP implementation and
     * want to use only RevenueCat's backend. Default is FALSE. If you are on Android and setting this to ON, you will have
     * to acknowledge the purchases yourself.
     */
    Purchases.setup = function (apiKey, appUserID, observerMode) {
        if (observerMode === void 0) { observerMode = false; }
        window.cordova.exec(function (purchaserInfo) {
            window.cordova.fireWindowEvent("onPurchaserInfoUpdated", purchaserInfo);
        }, null, PLUGIN_NAME, "setupPurchases", [apiKey, appUserID, observerMode]);
    };
    /**
     * Set this to true if you are passing in an appUserID but it is anonymous, this is true by default if you didn't pass an appUserID
     * If a user tries to purchase a product that is active on the current app store account, we will treat it as a restore and alias
     * the new ID with the previous id.
     */
    Purchases.setAllowSharingStoreAccount = function (allowSharing) {
        window.cordova.exec(null, null, PLUGIN_NAME, "setAllowSharingStoreAccount", [allowSharing]);
    };
    /**
     * Add a dict of attribution information
     * @param {object} data Attribution data from any of the attribution networks in Purchases.ATTRIBUTION_NETWORKS
     * @param {ATTRIBUTION_NETWORKS} network Which network, see Purchases.ATTRIBUTION_NETWORKS
     * @param {string?} networkUserId An optional unique id for identifying the user. Needs to be a string.
     */
    Purchases.addAttributionData = function (data, network, networkUserId) {
        window.cordova.exec(null, null, PLUGIN_NAME, "addAttributionData", [
            data,
            network,
            networkUserId,
        ]);
    };
    /**
     * Gets the map of entitlements -> offerings -> products
     * @param {function(PurchasesOfferings):void} callback Callback triggered after a successful getEntitlements call. It will receive an structure of entitlements.
     * @param {function(PurchasesError):void} errorCallback Callback triggered after an error or when retrieving entitlements.
     */
    Purchases.getOfferings = function (callback, errorCallback) {
        window.cordova.exec(callback, errorCallback, PLUGIN_NAME, "getOfferings", []);
    };
    /**
     * Fetch the product info
     * @param {[string]} productIdentifiers Array of product identifiers
     * @param {function(PurchasesProduct[]):void} callback Callback triggered after a successful getProducts call. It will receive an array of product objects.
     * @param {function(PurchasesError):void} errorCallback Callback triggered after an error or when retrieving products
     * @param {PURCHASE_TYPE} type Optional type of products to fetch, can be inapp or subs. Subs by default
     */
    Purchases.getProducts = function (productIdentifiers, callback, errorCallback, type) {
        if (type === void 0) { type = PURCHASE_TYPE.SUBS; }
        window.cordova.exec(callback, errorCallback, PLUGIN_NAME, "getProductInfo", [productIdentifiers, type]);
    };
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
    Purchases.makePurchase = function (productIdentifier, callback, errorCallback, oldSKU, type) {
        if (type === void 0) { type = PURCHASE_TYPE.SUBS; }
        if (Array.isArray(oldSKU)) {
            throw new Error("Calling a deprecated method!");
        }
        if (oldSKU !== undefined && oldSKU !== null) {
            this.purchaseProduct(productIdentifier, callback, errorCallback, { oldSKU: oldSKU }, type);
        }
        else {
            this.purchaseProduct(productIdentifier, callback, errorCallback, null, type);
        }
    };
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
    Purchases.purchaseProduct = function (productIdentifier, callback, errorCallback, upgradeInfo, type) {
        if (type === void 0) { type = PURCHASE_TYPE.SUBS; }
        window.cordova.exec(callback, function (response) {
            var userCancelled = response.userCancelled, error = __rest(response, ["userCancelled"]);
            errorCallback({
                error: error,
                userCancelled: userCancelled,
            });
        }, PLUGIN_NAME, "purchaseProduct", [
            productIdentifier,
            upgradeInfo !== undefined && upgradeInfo !== null ? upgradeInfo.oldSKU : null,
            upgradeInfo !== undefined && upgradeInfo !== null
                ? upgradeInfo.prorationMode
                : null,
            type,
        ]);
    };
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
    Purchases.purchasePackage = function (aPackage, callback, errorCallback, upgradeInfo) {
        window.cordova.exec(callback, function (response) {
            var userCancelled = response.userCancelled, error = __rest(response, ["userCancelled"]);
            errorCallback({
                error: error,
                userCancelled: userCancelled,
            });
        }, PLUGIN_NAME, "purchasePackage", [
            aPackage.identifier,
            aPackage.offeringIdentifier,
            upgradeInfo !== undefined && upgradeInfo !== null
                ? upgradeInfo.oldSKU
                : null,
            upgradeInfo !== undefined && upgradeInfo !== null
                ? upgradeInfo.prorationMode
                : null,
        ]);
    };
    /**
     * Restores a user's previous purchases and links their appUserIDs to any user's also using those purchases.
     * @param {function(PurchaserInfo):void} callback Callback that will receive the new purchaser info after restoring transactions.
     * @param {function(PurchasesError):void} errorCallback Callback that will be triggered whenever there is any problem restoring the user transactions. This gets normally triggered if there
     * is an error retrieving the new purchaser info for the new user or the user cancelled the restore
     */
    Purchases.restoreTransactions = function (callback, errorCallback) {
        window.cordova.exec(callback, errorCallback, PLUGIN_NAME, "restoreTransactions", []);
    };
    /**
     * Get the appUserID that is currently in placed in the SDK
     * @param {function(string):void} callback Callback that will receive the current appUserID
     */
    Purchases.getAppUserID = function (callback) {
        window.cordova.exec(callback, null, PLUGIN_NAME, "getAppUserID", []);
    };
    /**
     * This function will alias two appUserIDs together.
     * @param {string} newAppUserID The new appUserID that should be linked to the currently identified appUserID. Needs to be a string.
     * @param {function(PurchaserInfo):void} callback Callback that will receive the new purchaser info after creating the alias
     * @param {function(PurchasesError):void} errorCallback Callback that will be triggered whenever there is any problem creating the alias. This gets normally triggered if there
     * is an error retrieving the new purchaser info for the new user or there is an error creating the alias.
     */
    Purchases.createAlias = function (newAppUserID, callback, errorCallback) {
        // noinspection SuspiciousTypeOfGuard
        if (typeof newAppUserID !== "string" || newAppUserID === "") {
            throw new Error("newAppUserID is a required string and cannot be empty");
        }
        window.cordova.exec(callback, errorCallback, PLUGIN_NAME, "createAlias", [
            newAppUserID,
        ]);
    };
    /**
     * This function will identify the current user with an appUserID. Typically this would be used after a logout to identify a new user without calling configure
     * @param {string} newAppUserID The appUserID that should be linked to the currently user
     * @param {function(PurchaserInfo):void} callback Callback that will receive the new purchaser info after identifying.
     * @param {function(PurchasesError, boolean):void} errorCallback Callback that will be triggered whenever there is any problem identifying the new user. This gets normally triggered if there
     * is an error retrieving the new purchaser info for the new user.
     */
    Purchases.identify = function (newAppUserID, callback, errorCallback) {
        // noinspection SuspiciousTypeOfGuard
        if (typeof newAppUserID !== "string" || newAppUserID === "") {
            throw new Error("newAppUserID is a required string and cannot be empty");
        }
        window.cordova.exec(callback, errorCallback, PLUGIN_NAME, "identify", [
            newAppUserID,
        ]);
    };
    /**
     * Resets the Purchases client clearing the saved appUserID. This will generate a random user id and save it in the cache.
     * @param {function(PurchaserInfo):void} callback Callback that will receive the new purchaser info after resetting
     * @param {function(PurchasesError, boolean):void} errorCallback Callback that will be triggered whenever there is any problem resetting the SDK. This gets normally triggered if there
     * is an error retrieving the new purchaser info for the new user.
     */
    Purchases.reset = function (callback, errorCallback) {
        window.cordova.exec(callback, errorCallback, PLUGIN_NAME, "reset", []);
    };
    /**
     * Gets the current purchaser info. This call will return the cached purchaser info unless the cache is stale, in which case,
     * it will make a network call to retrieve it from the servers.
     * @param {function(PurchaserInfo):void} callback Callback that will receive the purchaser info
     * @param {function(PurchasesError, boolean):void} errorCallback Callback that will be triggered whenever there is any problem retrieving the purchaser info
     */
    Purchases.getPurchaserInfo = function (callback, errorCallback) {
        window.cordova.exec(callback, errorCallback, PLUGIN_NAME, "getPurchaserInfo", []);
    };
    /**
     * Enables/Disables debugs logs
     * @param {Boolean} enabled Enable or not debug logs
     */
    Purchases.setDebugLogsEnabled = function (enabled) {
        window.cordova.exec(null, null, PLUGIN_NAME, "setDebugLogsEnabled", [
            enabled,
        ]);
    };
    /**
     * This method will send all the purchases to the RevenueCat backend. Call this when using your own implementation
     * for subscriptions anytime a sync is needed, like after a successful purchase.
     *
     * @warning This function should only be called if you're not calling makePurchase.
     */
    Purchases.syncPurchases = function () {
        window.cordova.exec(null, null, PLUGIN_NAME, "syncPurchases", []);
    };
    /**
     * Enable automatic collection of Apple Search Ads attribution. Disabled by default.
     *
     * @param {Boolean} enabled Enable or not automatic collection
     */
    Purchases.setAutomaticAppleSearchAdsAttributionCollection = function (enabled) {
        window.cordova.exec(null, null, PLUGIN_NAME, "setAutomaticAppleSearchAdsAttributionCollection", [enabled]);
    };
    /**
     * @param {function(boolean):void} callback Will be sent a boolean indicating if the `appUserID` has been generated
     * by RevenueCat or not.
     */
    Purchases.isAnonymous = function (callback) {
        window.cordova.exec(callback, null, PLUGIN_NAME, "isAnonymous", []);
    };
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
     *  @param callback Array of product identifiers for which you want to compute eligibility
     *  @returns {function({ [productId: string]: IntroEligibility }):void} callback Will be sent map of IntroEligibility
     *  per productId
     */
    Purchases.checkTrialOrIntroductoryPriceEligibility = function (productIdentifiers, callback) {
        window.cordova.exec(callback, null, PLUGIN_NAME, "checkTrialOrIntroductoryPriceEligibility", [productIdentifiers]);
    };
    /**
     * @deprecated use ATTRIBUTION_NETWORK instead
     *
     * Enum for attribution networks
     * @readonly
     * @enum {Number}
     */
    Purchases.ATTRIBUTION_NETWORKS = ATTRIBUTION_NETWORK;
    /**
     * Enum for attribution networks
     * @readonly
     * @enum {Number}
     */
    Purchases.ATTRIBUTION_NETWORK = ATTRIBUTION_NETWORK;
    /**
     * Supported SKU types.
     * @readonly
     * @enum {string}
     */
    Purchases.PURCHASE_TYPE = PURCHASE_TYPE;
    /**
     * Replace SKU's ProrationMode.
     * @readonly
     * @enum {number}
     */
    Purchases.PRORATION_MODE = PRORATION_MODE;
    /**
     * Enumeration of all possible Package types.
     * @readonly
     * @enum {string}
     */
    Purchases.PACKAGE_TYPE = PACKAGE_TYPE;
    /**
     * Enum of different possible states for intro price eligibility status.
     * @readonly
     * @enum {number}
     */
    Purchases.INTRO_ELIGIBILITY_STATUS = INTRO_ELIGIBILITY_STATUS;
    return Purchases;
}());
if (!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.Purchases) {
    window.plugins.Purchases = new Purchases();
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = Purchases;
}
exports.default = Purchases;

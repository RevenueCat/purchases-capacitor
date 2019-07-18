"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PLUGIN_NAME = "PurchasesPlugin";
var ATTRIBUTION_NETWORKS;
(function (ATTRIBUTION_NETWORKS) {
    ATTRIBUTION_NETWORKS[ATTRIBUTION_NETWORKS["APPLE_SEARCH_ADS"] = 0] = "APPLE_SEARCH_ADS";
    ATTRIBUTION_NETWORKS[ATTRIBUTION_NETWORKS["ADJUST"] = 1] = "ADJUST";
    ATTRIBUTION_NETWORKS[ATTRIBUTION_NETWORKS["APPSFLYER"] = 2] = "APPSFLYER";
    ATTRIBUTION_NETWORKS[ATTRIBUTION_NETWORKS["BRANCH"] = 3] = "BRANCH";
    ATTRIBUTION_NETWORKS[ATTRIBUTION_NETWORKS["TENJIN"] = 4] = "TENJIN";
    ATTRIBUTION_NETWORKS[ATTRIBUTION_NETWORKS["FACEBOOK"] = 5] = "FACEBOOK";
})(ATTRIBUTION_NETWORKS = exports.ATTRIBUTION_NETWORKS || (exports.ATTRIBUTION_NETWORKS = {}));
var Purchases = /** @class */ (function () {
    function Purchases() {
    }
    /**
     * Sets up Purchases with your API key and an app user id.
     * @param {String} apiKey RevenueCat API Key. Needs to be a String
     * @param {String?} appUserID A unique id for identifying the user
     * @param {Boolean} observerMode An optional boolean. Set this to TRUE if you have your own IAP implementation and want to use only RevenueCat's backend. Default is FALSE.
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
     * @param {String?} networkUserId An optional unique id for identifying the user. Needs to be a string.
     */
    Purchases.addAttributionData = function (data, network, networkUserId) {
        window.cordova.exec(null, null, PLUGIN_NAME, "addAttributionData", [
            data,
            network,
            networkUserId,
        ]);
    };
    /**
     * Success callback used when retrieving entitlements.
     *
     * @callback EntitlementsSuccessCallback
     * @param {Map<String, Map<String, Product>>} entitlements Map of entitlements -> offerings -> products
     */
    /**
     * Gets the map of entitlements -> offerings -> products
     * @param {EntitlementsSuccessCallback} callback Callback triggered after a successful getEntitlements call. It will receive an structure of entitlements.
     * @param {ErrorCallback} errorcallback Callback triggered after an error or when retrieving entitlements.
     */
    Purchases.getEntitlements = function (callback, errorcallback) {
        window.cordova.exec(callback, errorcallback, PLUGIN_NAME, "getEntitlements", []);
    };
    /**
     * Success callback used when retrieving products.
     *
     * @callback ProductsSuccessCallback
     * @param {[Product]} products - Array containing the product objects.
     */
    /**
     * Fetch the product info
     * @param {[String]} productIdentifiers Array of product identifiers
     * @param {ProductsSuccessCallback} callback Callback triggered after a successful getProducts call. It will receive an array of product objects.
     * @param {ErrorCallback} errorcallback Callback triggered after an error or when retrieving products
     * @param {String} type Optional type of products to fetch, can be inapp or subs. Subs by default
     */
    Purchases.getProducts = function (productIdentifiers, callback, errorcallback, type) {
        if (type === void 0) { type = "subs"; }
        window.cordova.exec(callback, errorcallback, PLUGIN_NAME, "getProductInfo", [productIdentifiers, type]);
    };
    /**
     * Success callback used when making a purchase. This callback will be triggered after a successful purchase.
     * Cancelled purchases will trigger an error callback.
     *
     * @callback makePurchaseSuccessCallback
     * @param {string} productIdentifier - The product identifier of the purchased product.
     * @param {object} purchaserInfo - The updated Purchaser Info.
     */
    /**
     * Error callback triggered when making a purchase. Cancelled purchases will also trigger this callback and
     * error.userCancelled will be true
     *
     * @callback makePurchaseErrorCallback
     * @param {object} error - The error containing message, code, domain and if user cancelled the purchase.
     * @param {Boolean} userCancelled - Wether the user cancelled the purchase or not.
     */
    /**
     * Make a purchase
     * @param {string} productIdentifier The product identifier of the product you want to purchase.
     * @param {makePurchaseSuccessCallback} callback Callback triggered after a successful purchase.
     * @param {makePurchaseErrorCallback} errorcallback Callback triggered after an error or when the user cancels the purchase.
     * If user cancelled, userCancelled will be true
     * @param {String?} oldSku Optional sku you wish to upgrade from.
     * @param {String} type Optional type of product, can be inapp or subs. Subs by default
     */
    Purchases.makePurchase = function (productIdentifier, callback, errorcallback, oldSku, type) {
        if (type === void 0) { type = "subs"; }
        if (Array.isArray(oldSku)) {
            throw new Error("Calling a deprecated method!");
        }
        window.cordova.exec(callback, errorcallback, PLUGIN_NAME, "makePurchase", [
            productIdentifier,
            oldSku,
            type,
        ]);
    };
    /**
     * Restores a user's previous purchases and links their appUserIDs to any user's also using those purchases.
     * @param {PurchaserInfoCallback} callback Callback that will receive the new purchaser info after restoring transactions.
     * @param {ErrorCallback} errorcallback Callback that will be triggered whenever there is any problem restoring the user transactions. This gets normally triggered if there
     * is an error retrieving the new purchaser info for the new user or the user cancelled the restore
     */
    Purchases.restoreTransactions = function (callback, errorcallback) {
        window.cordova.exec(callback, errorcallback, PLUGIN_NAME, "restoreTransactions", []);
    };
    /**
     * Success callback used when calling a method that returns back a string
     *
     * @callback StringCallback
     * @param {String} string - The returned String.
     */
    /**
     * Get the appUserID that is currently in placed in the SDK
     * @param {StringCallback} callback Callback that will receive the current appUserID
     */
    Purchases.getAppUserID = function (callback) {
        window.cordova.exec(callback, null, PLUGIN_NAME, "getAppUserID", []);
    };
    /**
     * This function will alias two appUserIDs together.
     * @param {String} newAppUserID The new appUserID that should be linked to the currently identified appUserID. Needs to be a string.
     * @param {PurchaserInfoCallback} callback Callback that will receive the new purchaser info after creating the alias
     * @param {ErrorCallback} errorcallback Callback that will be triggered whenever there is any problem creating the alias. This gets normally triggered if there
     * is an error retrieving the new purchaser info for the new user or there is an error creating the alias.
     */
    Purchases.createAlias = function (newAppUserID, callback, errorcallback) {
        window.cordova.exec(callback, errorcallback, PLUGIN_NAME, "createAlias", [
            newAppUserID,
        ]);
    };
    /**
     * This function will identify the current user with an appUserID. Typically this would be used after a logout to identify a new user without calling configure
     * @param {String} newAppUserID The appUserID that should be linked to the currently user
     * @param {PurchaserInfoCallback} callback Callback that will receive the new purchaser info after identifying.
     * @param {ErrorCallback} errorcallback Callback that will be triggered whenever there is any problem identifying the new user. This gets normally triggered if there
     * is an error retrieving the new purchaser info for the new user.
     */
    Purchases.identify = function (newAppUserID, callback, errorcallback) {
        if (typeof newAppUserID === "undefined" || newAppUserID === "") {
            throw new Error("newAppUserID is required and cannot be empty");
        }
        window.cordova.exec(callback, errorcallback, PLUGIN_NAME, "identify", [
            newAppUserID,
        ]);
    };
    /**
     * Resets the Purchases client clearing the saved appUserID. This will generate a random user id and save it in the cache.
     * @param {PurchaserInfoCallback} callback Callback that will receive the new purchaser info after resetting
     * @param {ErrorCallback} errorcallback Callback that will be triggered whenever there is any problem resetting the SDK. This gets normally triggered if there
     * is an error retrieving the new purchaser info for the new user.
     */
    Purchases.reset = function (callback, errorcallback) {
        window.cordova.exec(callback, errorcallback, PLUGIN_NAME, "reset", []);
    };
    /**
     * Gets the current purchaser info. This call will return the cached purchaser info unless the cache is stale, in which case,
     * it will make a network call to retrieve it from the servers.
     * @param {PurchaserInfoCallback} callback Callback that will receive the purchaser info
     * @param {ErrorCallback} errorcallback Callback that will be triggered whenever there is any problem retrieving the purchaser info
     */
    Purchases.getPurchaserInfo = function (callback, errorcallback) {
        window.cordova.exec(callback, errorcallback, PLUGIN_NAME, "getPurchaserInfo", []);
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
     * @deprecated Use setAutomaticAttributionCollection instead.
     *
     * @param {Boolean} enabled Enable or not automatic collection
     */
    Purchases.setAutomaticAttributionCollection = function (enabled) {
        console.warn("WARNING! This function is deprecated. Use setAutomaticAppleSearchAdsAttributionCollection instead.");
        window.cordova.exec(null, null, PLUGIN_NAME, "setAutomaticAppleSearchAdsAttributionCollection", [enabled]);
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
     * Enum for attribution networks
     * @readonly
     * @enum {Number}
     */
    Purchases.ATTRIBUTION_NETWORKS = {
        APPLE_SEARCH_ADS: 0,
        ADJUST: 1,
        APPSFLYER: 2,
        BRANCH: 3,
        TENJIN: 4,
        FACEBOOK: 5,
    };
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

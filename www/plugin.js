const PLUGIN_NAME = "PurchasesPlugin";
class Purchases {
  /**
   * Sets up Purchases with your API key and an app user id.
   * @param {String} apiKey RevenueCat API Key. Needs to be a String
   * @param {String?} appUserID A unique id for identifying the user
   */
  static setup(apiKey, appUserID) {
    window.cordova.exec(null, null, PLUGIN_NAME, "setupPurchases", [
      apiKey,
      appUserID
    ]);
  }

  /**
   * Set this to true if you are passing in an appUserID but it is anonymous, this is true by default if you didn't pass an appUserID
   * If a user tries to purchase a product that is active on the current app store account, we will treat it as a restore and alias
   * the new ID with the previous id.
   */
  static setAllowSharingStoreAccount(allowSharing) {
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
   * @param {Dict} data Attribution data from AppsFlyer, Adjust, or Branch
   * @param {ATTRIBUTION_NETWORKS} network Which network, see Purchases.ATTRIBUTION_NETWORKS
   */
  static addAttributionData(data, network) {
    window.cordova.exec(null, null, PLUGIN_NAME, "addAttributionData", [
      data,
      network
    ]);
  }
  
  /**
   * Success callback used when retrieving entitlements.
   *
   * @callback EntitlementsSuccessCallback
   * @param {Map<String, Map<String, Product>>} entitlements Map of entitlements -> offerings -> products
   */

  /**
   * Gets the map of entitlements -> offerings -> products
   * @param {[String]} productIdentifiers Array of product identifiers
   * @param {EntitlementsSuccessCallback} callback Callback triggered after a successful getEntitlements call. It will receive an structure of entitlements.
   * @param {ErrorCallback} errorcallback Callback triggered after an error or when retrieving entitlements.
   */
  static getEntitlements(callback, errorcallback) {
    window.cordova.exec(
      callback,
      errorcallback,
      PLUGIN_NAME,
      "getEntitlements",
      []
    );
  }

  /**
   * Success callback used when retrieving products.
   *
   * @callback ProductsSuccessCallback
   * @param {[object]} products - Array containing the product objects.
   */

  /**
   * Fetch the product info
   * @param {[String]} productIdentifiers Array of product identifiers
   * @param {ProductsSuccessCallback} callback Callback triggered after a successful getProducts call. It will receive an array of product objects.
   * @param {ErrorCallback} errorcallback Callback triggered after an error or when retrieving products
   * @param {String} type Optional type of products to fetch, can be inapp or subs. Subs by default
   */
  static getProducts(
    productIdentifiers,
    callback,
    errorcallback,
    type = "subs"
  ) {
    window.cordova.exec(
      callback,
      errorcallback,
      PLUGIN_NAME,
      "getProductInfo",
      [productIdentifiers, type]
    );
  }

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
   */

  /**
   * Make a purchase
   * @param {string} productIdentifier The product identifier of the product you want to purchase.
   * @param {makePurchaseSuccessCallback} callback Callback triggered after a successful purchase.
   * @param {makePurchaseErrorCallback} errorcallback Callback triggered after an error or when the user cancels the purchase.
   * If user cancelled, error.userCancelled will be true
   * @param {Array<String>} oldSkus Optional array of skus you wish to upgrade from.
   * @param {String} type Optional type of product, can be inapp or subs. Subs by default
   */
  static makePurchase(
    productIdentifier,
    callback,
    errorcallback,
    oldSkus = [],
    type = "subs"
  ) {
    window.cordova.exec(
      callback,
      ({ code, domain, message }) => {
        const userCancelledDomainCodes = {
          1: "Play Billing",
          2: "SKErrorDomain"
        };
        // TODO send product identifier?
        errorcallback({
          code,
          domain,
          message,
          userCancelled: userCancelledDomainCodes[code] === domain
        });
      },
      PLUGIN_NAME,
      "makePurchase",
      [productIdentifier, oldSkus, type]
    );
  }

  /**
   * Restores a user's previous purchases and links their appUserIDs to any user's also using those purchases.
   * @param {PurchaserInfoCallback} callback Callback that will receive the new purchaser info after restoring transactions.
   * @param {ErrorCallback} errorcallback Callback that will be triggered whenever there is any problem restoring the user transactions. This gets normally triggered if there
   * is an error retrieving the new purchaser info for the new user or the user cancelled the restore
   */
  static restoreTransactions(callback, errorcallback) {
    window.cordova.exec(
      callback,
      errorcallback,
      PLUGIN_NAME,
      "restoreTransactions",
      []
    );
  }

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
  static getAppUserID(callback) {
    window.cordova.exec(callback, null, PLUGIN_NAME, "getAppUserID", []);
  }

  /**
   * This function will alias two appUserIDs together.
   * @param {String} newAppUserID The new appUserID that should be linked to the currently identified appUserID. Needs to be a string.
   * @param {PurchaserInfoCallback} callback Callback that will receive the new purchaser info after creating the alias
   * @param {ErrorCallback} errorcallback Callback that will be triggered whenever there is any problem creating the alias. This gets normally triggered if there
   * is an error retrieving the new purchaser info for the new user or there is an error creating the alias.
   */
  static createAlias(newAppUserID, callback, errorcallback) {
    window.cordova.exec(callback, errorcallback, PLUGIN_NAME, "createAlias", [
      newAppUserID
    ]);
  }

  /**
   * This function will identify the current user with an appUserID. Typically this would be used after a logout to identify a new user without calling configure
   * @param {String} newAppUserID The appUserID that should be linked to the currently user
   * @param {PurchaserInfoCallback} callback Callback that will receive the new purchaser info after identifying.
   * @param {ErrorCallback} errorcallback Callback that will be triggered whenever there is any problem identifying the new user. This gets normally triggered if there
   * is an error retrieving the new purchaser info for the new user.
   */
  static identify(newAppUserID, callback, errorcallback) {
    window.cordova.exec(callback, errorcallback, PLUGIN_NAME, "identify", [
      newAppUserID
    ]);
  }

  /**
   * Resets the Purchases client clearing the saved appUserID. This will generate a random user id and save it in the cache.
   * @param {PurchaserInfoCallback} callback Callback that will receive the new purchaser info after resetting
   * @param {ErrorCallback} errorcallback Callback that will be triggered whenever there is any problem resetting the SDK. This gets normally triggered if there
   * is an error retrieving the new purchaser info for the new user.
   */
  static reset(callback, errorcallback) {
    window.cordova.exec(callback, errorcallback, PLUGIN_NAME, "reset", []);
  }

  /** Sets a function to be called on updated purchaser info
   * @param {PurchaserInfoCallback} callback Callback that will receive the purchaser info
   * @param {ErrorCallback} errorcallback Callback that will be triggered whenever there is any problem retrieving the purchaser info
   */
  static getPurchaserInfo(callback, errorcallback) {
    window.cordova.exec(
      callback,
      errorcallback,
      PLUGIN_NAME,
      "getPurchaserInfo",
      []
    );
  }

  /** Sets a function to be called on updated purchaser info
   * @param {PurchaserInfoCallback} updatedPurchaserInfoListener PurchaserInfo update listener
   */
  static setUpdatedPurchaserInfoListener(updatedPurchaserInfoListener) {
    window.cordova.exec(
      updatedPurchaserInfoListener,
      null,
      PLUGIN_NAME,
      "setUpdatedPurchaserInfoListener",
      []
    );
  }

  /**
   * Removes a given UpdatedPurchaserInfoListener
   * @param {UpdatedPurchaserInfoListener} listenerToRemove UpdatedPurchaserInfoListener reference of the listener to remove
   * @returns {Boolean} True if listener was removed, false otherwise
   */
  static removeUpdatedPurchaserInfoListener() {
    window.cordova.exec(
      null,
      null,
      PLUGIN_NAME,
      "removeUpdatedPurchaserInfoListener",
      []
    );
  }

  /**
   * Enables/Disables debugs logs
   * @param {Boolean} enabled Enable or not debug logs
   */
  static setDebugLogsEnabled(enabled) {
    window.cordova.exec(null, null, PLUGIN_NAME, "setDebugLogsEnabled", [
      enabled
    ]);
  }

  /**
   * Success callback used when calling a method that returns back a purchaser info object
   *
   * @callback PurchaserInfoCallback
   * @param {Object} purchaserInfo - The returned Purchaser Info.
   */

  /**
   * Error callback triggered when calling a method that returns back a purchaser info object
   *
   * @callback ErrorCallback
   * @param {Object} error - The error object containing a message, code and an error domain.
   */
}

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
  TENJIN: 4
};

if (!window.plugins) window.plugins = {};

if (!window.plugins.Purchases) window.plugins.Purchases = new Purchases();

if (typeof module !== "undefined" && module.exports) module.exports = Purchases;

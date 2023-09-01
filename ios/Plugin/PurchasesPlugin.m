#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(PurchasesPlugin, "Purchases",
           CAP_PLUGIN_METHOD(configure, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(setMockWebResults, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(setFinishTransactions, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(setSimulatesAskToBuyInSandbox, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(getOfferings, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getProducts, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(purchaseStoreProduct, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(purchaseDiscountedProduct, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(purchasePackage, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(purchaseSubscriptionOption, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(purchaseDiscountedPackage, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(restorePurchases, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getAppUserID, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(logIn, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(logOut, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setLogLevel, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(getCustomerInfo, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(syncPurchases, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(syncObserverModeAmazonPurchase, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(enableAdServicesAttributionTokenCollection, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(isAnonymous, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(checkTrialOrIntroductoryPriceEligibility, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getPromotionalOffer, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(invalidateCustomerInfoCache, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(presentCodeRedemptionSheet, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(setAttributes, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(setEmail, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(setPhoneNumber, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(setDisplayName, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(setPushToken, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(setProxyURL, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(collectDeviceIdentifiers, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(setAdjustID, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(setAppsflyerID, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(setFBAnonymousID, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(setMparticleID, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(setCleverTapID, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(setMixpanelDistinctID, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(setFirebaseAppInstanceID, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(setOnesignalID, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(setAirshipChannelID, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(setMediaSource, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(setCampaign, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(setAdGroup, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(setAd, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(setKeyword, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(setCreative, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(canMakePayments, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(beginRefundRequestForActiveEntitlement, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(beginRefundRequestForEntitlement, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(beginRefundRequestForProduct, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(isConfigured, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setLogHandler, CAPPluginReturnCallback);
           CAP_PLUGIN_METHOD(addCustomerInfoUpdateListener, CAPPluginReturnCallback);
           CAP_PLUGIN_METHOD(removeCustomerInfoUpdateListener, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(addShouldPurchasePromoProductListener, CAPPluginReturnCallback);
           CAP_PLUGIN_METHOD(removeShouldPurchasePromoProductListener, CAPPluginReturnPromise);
)

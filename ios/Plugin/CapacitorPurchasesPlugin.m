#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(CapacitorPurchasesPlugin, "CapacitorPurchases",
        CAP_PLUGIN_METHOD(setup, CAPPluginReturnPromise);
        CAP_PLUGIN_METHOD(getProducts, CAPPluginReturnPromise);
        CAP_PLUGIN_METHOD(getOfferings, CAPPluginReturnPromise);
        CAP_PLUGIN_METHOD(getProduct, CAPPluginReturnPromise);
        CAP_PLUGIN_METHOD(purchaseProduct, CAPPluginReturnPromise);
        CAP_PLUGIN_METHOD(purchasePackage, CAPPluginReturnPromise);
        CAP_PLUGIN_METHOD(restorePurchases, CAPPluginReturnPromise);
        CAP_PLUGIN_METHOD(setAttributes, CAPPluginReturnPromise);
        CAP_PLUGIN_METHOD(collectDeviceIdentifiers, CAPPluginReturnPromise);
        CAP_PLUGIN_METHOD(logIn, CAPPluginReturnPromise);
        CAP_PLUGIN_METHOD(logOut, CAPPluginReturnPromise);
        CAP_PLUGIN_METHOD(getCustomerInfo, CAPPluginReturnPromise);
        CAP_PLUGIN_METHOD(setDebugLogsEnabled, CAPPluginReturnPromise);
)

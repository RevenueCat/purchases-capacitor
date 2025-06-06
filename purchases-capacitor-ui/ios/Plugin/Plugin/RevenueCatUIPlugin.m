#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(RevenueCatUIPlugin, "RevenueCatUI",
           CAP_PLUGIN_METHOD(presentPaywall, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(presentPaywallIfNeeded, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(presentCustomerCenter, CAPPluginReturnPromise);
) 
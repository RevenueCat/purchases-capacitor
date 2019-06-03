
#import <Purchases/RCPurchases.h>
#import <Cordova/CDVPlugin.h>

@interface CDVPurchasesPlugin : CDVPlugin
{
}

- (void)setupPurchases:(CDVInvokedUrlCommand *)command;
- (void)setAllowSharingStoreAccount:(CDVInvokedUrlCommand *)command;
- (void)addAttributionData:(CDVInvokedUrlCommand *)command;
- (void)getEntitlements:(CDVInvokedUrlCommand *)command;
- (void)getProductInfo:(CDVInvokedUrlCommand *)command;
- (void)makePurchase:(CDVInvokedUrlCommand *)command;
- (void)restoreTransactions:(CDVInvokedUrlCommand *)command;
- (void)getAppUserID:(CDVInvokedUrlCommand *)command;
- (void)createAlias:(CDVInvokedUrlCommand *)command;
- (void)identify:(CDVInvokedUrlCommand *)command;
- (void)reset:(CDVInvokedUrlCommand *)command;
- (void)setDebugLogsEnabled:(CDVInvokedUrlCommand *)command;
- (void)getPurchaserInfo:(CDVInvokedUrlCommand *)command;
- (void)syncPurchases:(CDVInvokedUrlCommand *)command;
- (void)setAutomaticAttributionCollection:(CDVInvokedUrlCommand *)command;

@end

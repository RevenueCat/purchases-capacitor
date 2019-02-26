
#import "CDVPurchasesPlugin.h"

@import StoreKit;

#import "RCPurchaserInfo+CDVPurchasesPlugin.h"
#import "RCEntitlement+CDVPurchasesPlugin.h"
#import "SKProduct+CDVPurchasesPlugin.h"

@interface CDVPurchasesPlugin () <RCPurchasesDelegate>

@property(nonatomic, retain) NSMutableDictionary *products;
@property(nonatomic, retain) NSString *updatedPurchaserInfoCallbackID;

@end

@implementation CDVPurchasesPlugin

- (void)setupPurchases:(CDVInvokedUrlCommand *)command {
    NSString *apiKey = command.arguments[0];
    NSString *appUserID = command.arguments[1];

    RCPurchases.sharedPurchases.delegate = nil;
    self.products = [NSMutableDictionary new];
    [RCPurchases configureWithAPIKey:apiKey appUserID:appUserID];
    RCPurchases.sharedPurchases.delegate = self;
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)setAllowSharingStoreAccount:(CDVInvokedUrlCommand *)command {
    BOOL allowSharingStoreAccount = (BOOL) command.arguments[0];

    RCPurchases.sharedPurchases.allowSharingAppStoreAccount = allowSharingStoreAccount;

    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)addAttributionData:(CDVInvokedUrlCommand *)command {
    NSAssert(RCPurchases.sharedPurchases, @"You must call setup first.");

    NSDictionary *data = command.arguments[0];
    NSInteger network = [command.arguments[1] integerValue];

    [RCPurchases.sharedPurchases addAttributionData:data fromNetwork:(RCAttributionNetwork) network];

    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)getEntitlements:(CDVInvokedUrlCommand *)command {
    NSAssert(RCPurchases.sharedPurchases, @"You must call setup first.");


    [RCPurchases.sharedPurchases entitlementsWithCompletionBlock:^(RCEntitlements *_Nullable entitlements, NSError *_Nullable error) {
        CDVPluginResult *pluginResult = nil;
        if (error) {
            // TODO: test
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:[self payloadForError:error]];
        } else {
            NSMutableDictionary *result = [NSMutableDictionary new];
            for (NSString *entId in entitlements) {
                RCEntitlement *entitlement = entitlements[entId];
                result[entId] = entitlement.dictionary;
            }

            for (RCEntitlement *entitlement in entitlements.allValues) {
                for (RCOffering *offering in entitlement.offerings.allValues) {
                    SKProduct *product = offering.activeProduct;
                    if (product != nil) {
                        self.products[product.productIdentifier] = product;
                    }
                }
            }
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:[NSDictionary dictionaryWithDictionary:result]];
        }
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)getProductInfo:(CDVInvokedUrlCommand *)command {
    NSArray *products = command.arguments[0];

    NSAssert(RCPurchases.sharedPurchases, @"You must call setup first.");
    [RCPurchases.sharedPurchases productsWithIdentifiers:products
                                         completionBlock:^(NSArray<SKProduct *> *_Nonnull products) {
                                             NSMutableArray *productObjects = [NSMutableArray new];
                                             for (SKProduct *p in products) {
                                                 self.products[p.productIdentifier] = p;
                                                 [productObjects addObject:p.dictionary];
                                             }
                                             CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:productObjects];
                                             [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
                                         }];
}

- (void)makePurchase:(CDVInvokedUrlCommand *)command {
    NSAssert(RCPurchases.sharedPurchases, @"You must call setup first.");

    NSString *productIdentifier = command.arguments[0];

    if (self.products[productIdentifier] == nil) {
        NSLog(@"Purchases cannot find product. Did you call getProductInfo first?");
        return;
    }
    [RCPurchases.sharedPurchases makePurchase:self.products[productIdentifier]
                          withCompletionBlock:^(SKPaymentTransaction *_Nullable transaction, RCPurchaserInfo *_Nullable purchaserInfo, NSError *_Nullable error) {
                              CDVPluginResult *pluginResult = nil;
                              if (error) {
                                  pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:[self payloadForError:error]];
                              } else {
                                  pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:@{@"productIdentifier": transaction.payment.productIdentifier, @"purchaserInfo": purchaserInfo.dictionary
                                  }];
                              }
                              [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
                          }];
}

- (void)restoreTransactions:(CDVInvokedUrlCommand *)command {
    NSAssert(RCPurchases.sharedPurchases, @"You must call setup first.");
    [RCPurchases.sharedPurchases restoreTransactionsWithCompletionBlock:^(RCPurchaserInfo *_Nullable purchaserInfo, NSError *_Nullable error) {
        CDVPluginResult *pluginResult = nil;
        if (error) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:[self payloadForError:error]];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:purchaserInfo.dictionary];
        }
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)getAppUserID:(CDVInvokedUrlCommand *)command {
    NSAssert(RCPurchases.sharedPurchases, @"You must call setup first.");
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:RCPurchases.sharedPurchases.appUserID];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)createAlias:(CDVInvokedUrlCommand *)command {
    NSString *newAppUserID = command.arguments[0];
    NSAssert(RCPurchases.sharedPurchases, @"You must call setup first.");
    [RCPurchases.sharedPurchases createAlias:newAppUserID completionBlock:^(RCPurchaserInfo *_Nullable purchaserInfo, NSError *_Nullable error) {
        CDVPluginResult *pluginResult = nil;
        if (error) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:[self payloadForError:error]];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:purchaserInfo.dictionary];
        }
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)identify:(CDVInvokedUrlCommand *)command {
    NSString *appUserID = command.arguments[0];
    NSAssert(RCPurchases.sharedPurchases, @"You must call setup first.");
    [RCPurchases.sharedPurchases identify:appUserID completionBlock:^(RCPurchaserInfo *_Nullable purchaserInfo, NSError *_Nullable error) {
        CDVPluginResult *pluginResult = nil;
        if (error) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:[self payloadForError:error]];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:purchaserInfo.dictionary];
        }
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)reset:(CDVInvokedUrlCommand *)command {
    NSAssert(RCPurchases.sharedPurchases, @"You must call setup first.");
    [RCPurchases.sharedPurchases resetWithCompletionBlock:^(RCPurchaserInfo *_Nullable purchaserInfo, NSError *_Nullable error) {
        CDVPluginResult *pluginResult = nil;
        if (error) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:[self payloadForError:error]];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:purchaserInfo.dictionary];
        }
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)setDebugLogsEnabled:(CDVInvokedUrlCommand *)command {
    RCPurchases.debugLogsEnabled = (BOOL) command.arguments[0];
}

- (void)getPurchaserInfo:(CDVInvokedUrlCommand *)command {
    NSAssert(RCPurchases.sharedPurchases, @"You must call setup first.");
    [RCPurchases.sharedPurchases purchaserInfoWithCompletionBlock:^(RCPurchaserInfo *_Nullable purchaserInfo, NSError *_Nullable error) {
        CDVPluginResult *pluginResult = nil;
        if (error) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:[self payloadForError:error]];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:purchaserInfo.dictionary];
        }
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)setUpdatedPurchaserInfoListener:(CDVInvokedUrlCommand *)command {
    self.updatedPurchaserInfoCallbackID = command.callbackId;
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_NO_RESULT];
    [pluginResult setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

#pragma mark Delegate Methods

- (void)purchases:(RCPurchases *)purchases didReceiveUpdatedPurchaserInfo:(RCPurchaserInfo *)purchaserInfo {
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:purchaserInfo.dictionary];
    [pluginResult setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.updatedPurchaserInfoCallbackID];
}

#pragma mark Response Payload Helpers

- (NSDictionary *)payloadForError:(NSError *)error {
    return @{
            @"message": error.localizedDescription,
            @"code": @(error.code),
            @"domain": error.domain
    };
}

@end

//
//  Created by RevenueCat.
//  Copyright © 2019 RevenueCat. All rights reserved.
//

#import "CDVPurchasesPlugin.h"

@import StoreKit;

#import "RCPurchaserInfo+HybridAdditions.h"
#import "RCEntitlement+HybridAdditions.h"
#import "SKProduct+HybridAdditions.h"

@interface CDVPurchasesPlugin () <RCPurchasesDelegate>

@property(nonatomic, retain) NSMutableDictionary *products;
@property(nonatomic, retain) NSString *updatedPurchaserInfoCallbackID;

@end

@implementation CDVPurchasesPlugin

- (void)setupPurchases:(CDVInvokedUrlCommand *)command {
    NSString *apiKey = [command argumentAtIndex:0];
    NSString *appUserID = [command argumentAtIndex:1];
    BOOL observerMode = [[command argumentAtIndex:2] boolValue];
    
    self.products = [NSMutableDictionary new];
    [RCPurchases configureWithAPIKey:apiKey appUserID:appUserID observerMode:observerMode];
    RCPurchases.sharedPurchases.delegate = self;
    
    self.updatedPurchaserInfoCallbackID = command.callbackId;
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_NO_RESULT];
    [pluginResult setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)setAllowSharingStoreAccount:(CDVInvokedUrlCommand *)command {
    NSAssert(RCPurchases.sharedPurchases, @"You must call setup first.");
    
    BOOL allowSharingStoreAccount = [[command argumentAtIndex:0] boolValue];
    
    RCPurchases.sharedPurchases.allowSharingAppStoreAccount = allowSharingStoreAccount;
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)addAttributionData:(CDVInvokedUrlCommand *)command {
    NSDictionary *data = [command argumentAtIndex:0];
    NSInteger network = [[command argumentAtIndex:1] integerValue];
    NSString *networkUserId = [command argumentAtIndex:2];
    
    [RCPurchases addAttributionData:data fromNetwork:(RCAttributionNetwork)network forNetworkUserId:networkUserId];
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)getEntitlements:(CDVInvokedUrlCommand *)command {
    NSAssert(RCPurchases.sharedPurchases, @"You must call setup first.");
    
    
    [RCPurchases.sharedPurchases entitlementsWithCompletionBlock:^(RCEntitlements *_Nullable entitlements, NSError *_Nullable error) {
        CDVPluginResult *pluginResult = nil;
        if (error) {
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
    NSArray *products = [command argumentAtIndex:0];
    
    NSAssert(RCPurchases.sharedPurchases, @"You must call setup first.");
    [RCPurchases.sharedPurchases productsWithIdentifiers:products
                                         completionBlock:^(NSArray<SKProduct *> *_Nonnull products) {
                                             NSMutableArray *productObjects = [NSMutableArray new];
                                             for (SKProduct *p in products) {
                                                 self.products[p.productIdentifier] = p;
                                                 [productObjects addObject:p.dictionary];
                                             }
                                             CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:productObjects];
                                             [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
                                         }];
}

- (void)makePurchase:(CDVInvokedUrlCommand *)command {
    NSAssert(RCPurchases.sharedPurchases, @"You must call setup first.");
    
    NSString *productIdentifier = [command argumentAtIndex:0];
    
    
    void (^completionBlock)(SKPaymentTransaction * _Nullable, RCPurchaserInfo * _Nullable, NSError * _Nullable, BOOL) = ^(SKPaymentTransaction *_Nullable transaction, RCPurchaserInfo *_Nullable purchaserInfo, NSError *_Nullable error, BOOL userCancelled) {
        CDVPluginResult *pluginResult = nil;
        if (error) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                         messageAsDictionary:@{
                                                               @"error": [self payloadForError:error],
                                                               @"userCancelled": @(userCancelled)
                                                               }];
        } else {
            pluginResult = [
                            CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                            messageAsDictionary:@{
                                                  @"productIdentifier": transaction.payment.productIdentifier,
                                                  @"purchaserInfo": purchaserInfo.dictionary
                                                  }];
        }
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    };
    if (self.products[productIdentifier] == nil) {
        [RCPurchases.sharedPurchases productsWithIdentifiers:[NSArray arrayWithObjects:productIdentifier, nil]
                                             completionBlock:^(NSArray<SKProduct *> * _Nonnull products) {
                                                 NSMutableArray *productObjects = [NSMutableArray new];
                                                 for (SKProduct *p in products) {
                                                     self.products[p.productIdentifier] = p;
                                                     [productObjects addObject:p.dictionary];
                                                 }
                                                 [RCPurchases.sharedPurchases makePurchase:self.products[productIdentifier]
                                                                       withCompletionBlock:completionBlock];
                                             }];
    } else {
        [RCPurchases.sharedPurchases makePurchase:self.products[productIdentifier]
                              withCompletionBlock:completionBlock];
    }
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
    NSString *newAppUserID = [command argumentAtIndex:0];
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
    NSString *appUserID = [command argumentAtIndex:0];
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
    RCPurchases.debugLogsEnabled = [[command argumentAtIndex:0] boolValue];
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

- (void)syncPurchases:(CDVInvokedUrlCommand *)command {
    
}

- (void)setAutomaticAppleSearchAdsAttributionCollection:(CDVInvokedUrlCommand *)command {
    RCPurchases.automaticAppleSearchAdsAttributionCollection = [[command argumentAtIndex:0] boolValue];
}

#pragma mark Delegate Methods

- (void)purchases:(RCPurchases *)purchases didReceiveUpdatedPurchaserInfo:(RCPurchaserInfo *)purchaserInfo {
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:purchaserInfo.dictionary];
    [pluginResult setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.updatedPurchaserInfoCallbackID];
}

#pragma mark Response Payload Helpers

- (NSDictionary *)payloadForError:(NSError *)error {
    NSMutableDictionary *dict = [NSMutableDictionary dictionaryWithDictionary:@{
                                                                                @"message": error.localizedDescription,
                                                                                @"code": @(error.code)
                                                                                }];
    if (error.userInfo[NSUnderlyingErrorKey]) {
        dict[@"underlyingErrorMessage"] = ((NSError *)error.userInfo[NSUnderlyingErrorKey]).localizedDescription;
    }
    
    if (error.userInfo[RCReadableErrorCodeKey]) {
        dict[@"readable_error_code"] = error.userInfo[RCReadableErrorCodeKey];
    }
    
    return dict;
}

@end

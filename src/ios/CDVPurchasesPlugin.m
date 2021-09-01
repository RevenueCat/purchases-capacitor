//
//  Created by RevenueCat.
//  Copyright © 2019 RevenueCat. All rights reserved.
//

#import "CDVPurchasesPlugin.h"

@import StoreKit;


@interface CDVPurchasesPlugin () <RCPurchasesDelegate>

@property (nonatomic, retain) NSString *updatedPurchaserInfoCallbackID;
@property (nonatomic, retain) NSString *shouldPurchasePromoProductCallbackID;
@property (nonatomic, retain) NSMutableArray<RCDeferredPromotionalPurchaseBlock> *defermentBlocks;

@end

@implementation CDVPurchasesPlugin

- (void)setupPurchases:(CDVInvokedUrlCommand *)command {
    NSString *apiKey = [command argumentAtIndex:0];
    NSString *appUserID = [command argumentAtIndex:1];
    BOOL observerMode = [[command argumentAtIndex:2] boolValue];
    NSString *userDefaultsSuiteName = [command argumentAtIndex:3];

    [RCPurchases configureWithAPIKey:apiKey
                           appUserID:appUserID
                        observerMode:observerMode
               userDefaultsSuiteName:userDefaultsSuiteName
                      platformFlavor:self.platformFlavor
               platformFlavorVersion:self.platformFlavorVersion];
    RCPurchases.sharedPurchases.delegate = self;

    self.updatedPurchaserInfoCallbackID = command.callbackId;
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_NO_RESULT];
    [pluginResult setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)setAllowSharingStoreAccount:(CDVInvokedUrlCommand *)command {
    BOOL allowSharingStoreAccount = [[command argumentAtIndex:0] boolValue];
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wdeprecated-declarations"
    [RCCommonFunctionality setAllowSharingStoreAccount:allowSharingStoreAccount];
#pragma GCC diagnostic pop
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)addAttributionData:(CDVInvokedUrlCommand *)command {
    NSDictionary *data = [command argumentAtIndex:0];
    NSInteger network = [[command argumentAtIndex:1] integerValue];
    NSString *networkUserId = [command argumentAtIndex:2];
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wdeprecated-declarations"
    [RCCommonFunctionality addAttributionData:data network:network networkUserId:networkUserId];
#pragma GCC diagnostic pop
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)getOfferings:(CDVInvokedUrlCommand *)command {
    [RCCommonFunctionality getOfferingsWithCompletionBlock:[self getResponseCompletionBlock:command]];
}

- (void)getProductInfo:(CDVInvokedUrlCommand *)command {
    NSArray *products = [command argumentAtIndex:0];

    [RCCommonFunctionality getProductInfo:products completionBlock:^(NSArray<NSDictionary *> *productObjects) {
        [self sendOKForCommand:command messageAsArray:productObjects];
    }];
}

- (void)purchaseProduct:(CDVInvokedUrlCommand *)command {
    NSString *productIdentifier = [command argumentAtIndex:0];

    [RCCommonFunctionality purchaseProduct:productIdentifier
                   signedDiscountTimestamp:nil
                           completionBlock:[self getResponseCompletionBlock:command]];
}

- (void)purchasePackage:(CDVInvokedUrlCommand *)command {
    NSString *packageIdentifier = [command argumentAtIndex:0];
    NSString *offeringIdentifier = [command argumentAtIndex:1];

    [RCCommonFunctionality purchasePackage:packageIdentifier
                                  offering:offeringIdentifier
                   signedDiscountTimestamp:nil
                           completionBlock:[self getResponseCompletionBlock:command]];
}

- (void)restoreTransactions:(CDVInvokedUrlCommand *)command {
    [RCCommonFunctionality restoreTransactionsWithCompletionBlock:[self getResponseCompletionBlock:command]];
}

- (void)syncPurchases:(CDVInvokedUrlCommand *)command {
    [RCCommonFunctionality syncPurchasesWithCompletionBlock:[self getResponseCompletionBlock:command]];
}

- (void)getAppUserID:(CDVInvokedUrlCommand *)command {
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[RCCommonFunctionality appUserID]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)logIn:(CDVInvokedUrlCommand *)command {
    NSString *appUserID = [command argumentAtIndex:0];
    [RCCommonFunctionality logInWithAppUserID:appUserID completionBlock:[self getResponseCompletionBlock:command]];
}

- (void)logOut:(CDVInvokedUrlCommand *)command {
    [RCCommonFunctionality logOutWithCompletionBlock:[self getResponseCompletionBlock:command]];
}

- (void)createAlias:(CDVInvokedUrlCommand *)command {
    NSString *newAppUserID = [command argumentAtIndex:0];
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wdeprecated-declarations"
    [RCCommonFunctionality createAlias:newAppUserID completionBlock:[self getResponseCompletionBlock:command]];
#pragma GCC diagnostic pop
}

- (void)identify:(CDVInvokedUrlCommand *)command {
    NSString *appUserID = [command argumentAtIndex:0];
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wdeprecated-declarations"
    [RCCommonFunctionality identify:appUserID completionBlock:[self getResponseCompletionBlock:command]];
#pragma GCC diagnostic pop
}

- (void)reset:(CDVInvokedUrlCommand *)command {
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wdeprecated-declarations"
    [RCCommonFunctionality resetWithCompletionBlock:[self getResponseCompletionBlock:command]];
#pragma GCC diagnostic pop
}

- (void)setDebugLogsEnabled:(CDVInvokedUrlCommand *)command {
    [RCCommonFunctionality setDebugLogsEnabled:[[command argumentAtIndex:0] boolValue]];
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)setSimulatesAskToBuyInSandbox:(CDVInvokedUrlCommand *)command {
    [RCCommonFunctionality setSimulatesAskToBuyInSandbox:[[command argumentAtIndex:0] boolValue]];
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)getPurchaserInfo:(CDVInvokedUrlCommand *)command {
    [RCCommonFunctionality getPurchaserInfoWithCompletionBlock:[self getResponseCompletionBlock:command]];
}

- (void)setAutomaticAppleSearchAdsAttributionCollection:(CDVInvokedUrlCommand *)command {
    [RCCommonFunctionality setAutomaticAppleSearchAdsAttributionCollection:[[command argumentAtIndex:0] boolValue]];
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)isAnonymous:(CDVInvokedUrlCommand *)command {
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:[RCCommonFunctionality isAnonymous]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)checkTrialOrIntroductoryPriceEligibility:(CDVInvokedUrlCommand *)command {
    NSArray *products = [command argumentAtIndex:0];
    [RCCommonFunctionality checkTrialOrIntroductoryPriceEligibility:products completionBlock:^(NSDictionary<NSString *,RCIntroEligibility *> * _Nonnull responseDictionary) {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:responseDictionary];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}
- (void)makeDeferredPurchase:(CDVInvokedUrlCommand *)command {
    NSNumber *callbackID = [command argumentAtIndex:0];
    assert(callbackID);
    assert(callbackID.integerValue >= 0);
    RCDeferredPromotionalPurchaseBlock defermentBlock = self.defermentBlocks[(NSUInteger)callbackID.integerValue];
    [RCCommonFunctionality makeDeferredPurchase:defermentBlock
                                completionBlock:[self getResponseCompletionBlock:command]];
}

- (void)setupShouldPurchasePromoProductCallback:(CDVInvokedUrlCommand *)command {
    self.shouldPurchasePromoProductCallbackID = command.callbackId;
}

- (void)invalidatePurchaserInfoCache:(CDVInvokedUrlCommand *)command { 
    [RCCommonFunctionality invalidatePurchaserInfoCache];
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)setProxyURLString:(CDVInvokedUrlCommand *)command {
    NSString *proxyURLString = [command argumentAtIndex:0];
    [RCCommonFunctionality setProxyURLString:proxyURLString];
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)presentCodeRedemptionSheet:(CDVInvokedUrlCommand *)command {
    if (@available(iOS 14.0, *)) {
        [RCCommonFunctionality presentCodeRedemptionSheet];
    } else {
        NSLog(@"[Purchases] Warning: tried to present codeRedemptionSheet, but it's only available on iOS 14.0 or greater.");
    }
    [self sendOKForCommand:command messageAsArray:nil];
}

#pragma mark Subscriber Attributes

- (void)setAttributes:(CDVInvokedUrlCommand *)command {
    NSDictionary <NSString *, NSString *> *attributes = [command argumentAtIndex:0];
    
    [RCCommonFunctionality setAttributes:attributes];
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)setEmail:(CDVInvokedUrlCommand *)command {
    NSString *email = [command argumentAtIndex:0];
    
    [RCCommonFunctionality setEmail:email];
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)setPhoneNumber:(CDVInvokedUrlCommand *)command {
    NSString *phoneNumber = [command argumentAtIndex:0];
    
    [RCCommonFunctionality setPhoneNumber:phoneNumber];
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)setDisplayName:(CDVInvokedUrlCommand *)command {
    NSString *displayName = [command argumentAtIndex:0];
    
    [RCCommonFunctionality setDisplayName:displayName];
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)setPushToken:(CDVInvokedUrlCommand *)command {
    NSString *pushToken = [command argumentAtIndex:0];
    
    [RCCommonFunctionality setPushToken:pushToken];
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)setAdjustID:(CDVInvokedUrlCommand *)command {
    NSString *adjustID = [command argumentAtIndex:0];
    [RCCommonFunctionality setAdjustID:adjustID];
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)setAppsflyerID:(CDVInvokedUrlCommand *)command {
    NSString *appsflyerID = [command argumentAtIndex:0];
    [RCCommonFunctionality setAppsflyerID:appsflyerID];
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)setFBAnonymousID:(CDVInvokedUrlCommand *)command {
    NSString *fbAnonymousID = [command argumentAtIndex:0];
    [RCCommonFunctionality setFBAnonymousID:fbAnonymousID];
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)setMparticleID:(CDVInvokedUrlCommand *)command {
    NSString *mparticleID = [command argumentAtIndex:0];
    [RCCommonFunctionality setMparticleID:mparticleID];
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)setOnesignalID:(CDVInvokedUrlCommand *)command {
    NSString *onesignalID = [command argumentAtIndex:0];
    [RCCommonFunctionality setOnesignalID:onesignalID];
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)setMediaSource:(CDVInvokedUrlCommand *)command {
    NSString *mediaSource = [command argumentAtIndex:0];
    [RCCommonFunctionality setMediaSource:mediaSource];
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)setCampaign:(CDVInvokedUrlCommand *)command {
    NSString *campaign = [command argumentAtIndex:0];
    [RCCommonFunctionality setCampaign:campaign];
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)setAdGroup:(CDVInvokedUrlCommand *)command {
    NSString *adGroup = [command argumentAtIndex:0];
    [RCCommonFunctionality setAdGroup:adGroup];
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)setAd:(CDVInvokedUrlCommand *)command {
    NSString *ad = [command argumentAtIndex:0];
    [RCCommonFunctionality setAd:ad];
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)setKeyword:(CDVInvokedUrlCommand *)command {
    NSString *keyword = [command argumentAtIndex:0];
    [RCCommonFunctionality setKeyword:keyword];
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)setCreative:(CDVInvokedUrlCommand *)command {
    NSString *creative = [command argumentAtIndex:0];
    [RCCommonFunctionality setCreative:creative];
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)collectDeviceIdentifiers:(CDVInvokedUrlCommand *)command {
    [RCCommonFunctionality collectDeviceIdentifiers];
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)canMakePayments:(CDVInvokedUrlCommand *)command {
    BOOL canMakePayments = [RCCommonFunctionality canMakePaymentsWithFeatures:[command argumentAtIndex:0]];
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:canMakePayments];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

#pragma mark Delegate Methods

- (void)purchases:(RCPurchases *)purchases didReceiveUpdatedPurchaserInfo:(RCPurchaserInfo *)purchaserInfo {
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:purchaserInfo.dictionary];
    [pluginResult setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.updatedPurchaserInfoCallbackID];
}

- (void)purchases:(RCPurchases *)purchases shouldPurchasePromoProduct:(SKProduct *)product
   defermentBlock:(RCDeferredPromotionalPurchaseBlock)makeDeferredPurchase {
    if (!self.defermentBlocks) {
        self.defermentBlocks = [NSMutableArray array];
    }
    [self.defermentBlocks addObject:makeDeferredPurchase];
    NSInteger position = self.defermentBlocks.count - 1;

    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                  messageAsDictionary:@{@"callbackID": @(position)}];
    [pluginResult setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.shouldPurchasePromoProductCallbackID];
}

#pragma mark Helpers

- (void (^)(NSDictionary *, RCErrorContainer *))getResponseCompletionBlock:(CDVInvokedUrlCommand *)command {
    return ^(NSDictionary *_Nullable responseDictionary, RCErrorContainer *_Nullable error) {
        CDVPluginResult *pluginResult = nil;
        if (error) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:error.info];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:responseDictionary];
        }
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    };
}

- (void)sendOKForCommand:(CDVInvokedUrlCommand *)command messageAsArray:(nullable NSArray *)theMessage {
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:theMessage];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (NSString *)platformFlavor {
    return @"cordova";
}

- (NSString *)platformFlavorVersion {
    return @"2.3.1";
}

@end

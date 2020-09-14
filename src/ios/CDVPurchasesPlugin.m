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

- (void)setupPurchases:(CDVInvokedUrlCommand *)command
{
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

- (void)setAllowSharingStoreAccount:(CDVInvokedUrlCommand *)command
{
    BOOL allowSharingStoreAccount = [[command argumentAtIndex:0] boolValue];

    [RCCommonFunctionality setAllowSharingStoreAccount:allowSharingStoreAccount];

    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)addAttributionData:(CDVInvokedUrlCommand *)command
{
    NSDictionary *data = [command argumentAtIndex:0];
    NSInteger network = [[command argumentAtIndex:1] integerValue];
    NSString *networkUserId = [command argumentAtIndex:2];

    [RCCommonFunctionality addAttributionData:data network:network networkUserId:networkUserId];

    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)getOfferings:(CDVInvokedUrlCommand *)command
{
    [RCCommonFunctionality getOfferingsWithCompletionBlock:[self getResponseCompletionBlock:command]];
}

- (void)getProductInfo:(CDVInvokedUrlCommand *)command
{
    NSArray *products = [command argumentAtIndex:0];

    [RCCommonFunctionality getProductInfo:products completionBlock:^(NSArray<NSDictionary *> *productObjects) {
        [self sendOKForCommand:command messageAsArray:productObjects];
    }];
}

- (void)purchaseProduct:(CDVInvokedUrlCommand *)command
{
    NSString *productIdentifier = [command argumentAtIndex:0];

    [RCCommonFunctionality purchaseProduct:productIdentifier
                   signedDiscountTimestamp:nil
                           completionBlock:[self getResponseCompletionBlock:command]];
}

- (void)purchasePackage:(CDVInvokedUrlCommand *)command
{
    NSString *packageIdentifier = [command argumentAtIndex:0];
    NSString *offeringIdentifier = [command argumentAtIndex:1];

    [RCCommonFunctionality purchasePackage:packageIdentifier
                                  offering:offeringIdentifier
                   signedDiscountTimestamp:nil
                           completionBlock:[self getResponseCompletionBlock:command]];
}

- (void)restoreTransactions:(CDVInvokedUrlCommand *)command
{
    [RCCommonFunctionality restoreTransactionsWithCompletionBlock:[self getResponseCompletionBlock:command]];
}

- (void)getAppUserID:(CDVInvokedUrlCommand *)command
{
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[RCCommonFunctionality appUserID]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)createAlias:(CDVInvokedUrlCommand *)command
{
    NSString *newAppUserID = [command argumentAtIndex:0];

    [RCCommonFunctionality createAlias:newAppUserID completionBlock:[self getResponseCompletionBlock:command]];
}

- (void)identify:(CDVInvokedUrlCommand *)command
{
    NSString *appUserID = [command argumentAtIndex:0];
    [RCCommonFunctionality identify:appUserID completionBlock:[self getResponseCompletionBlock:command]];
}

- (void)reset:(CDVInvokedUrlCommand *)command
{
    [RCCommonFunctionality resetWithCompletionBlock:[self getResponseCompletionBlock:command]];
}

- (void)setDebugLogsEnabled:(CDVInvokedUrlCommand *)command
{
    [RCCommonFunctionality setDebugLogsEnabled:[[command argumentAtIndex:0] boolValue]];
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)getPurchaserInfo:(CDVInvokedUrlCommand *)command
{
    [RCCommonFunctionality getPurchaserInfoWithCompletionBlock:[self getResponseCompletionBlock:command]];
}

- (void)syncPurchases:(CDVInvokedUrlCommand *)command
{
    // NO-OP
}

- (void)setAutomaticAppleSearchAdsAttributionCollection:(CDVInvokedUrlCommand *)command
{
    [RCCommonFunctionality setAutomaticAppleSearchAdsAttributionCollection:[[command argumentAtIndex:0] boolValue]];
    [self sendOKForCommand:command messageAsArray:nil];
}

- (void)isAnonymous:(CDVInvokedUrlCommand *)command
{
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:[RCCommonFunctionality isAnonymous]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)checkTrialOrIntroductoryPriceEligibility:(CDVInvokedUrlCommand *)command
{
    NSArray *products = [command argumentAtIndex:0];
    [RCCommonFunctionality checkTrialOrIntroductoryPriceEligibility:products completionBlock:^(NSDictionary<NSString *,RCIntroEligibility *> * _Nonnull responseDictionary) {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:responseDictionary];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}
- (void)makeDeferredPurchase:(CDVInvokedUrlCommand *)command
{
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

#pragma mark Delegate Methods

- (void)purchases:(RCPurchases *)purchases didReceiveUpdatedPurchaserInfo:(RCPurchaserInfo *)purchaserInfo
{
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:purchaserInfo.dictionary];
    [pluginResult setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.updatedPurchaserInfoCallbackID];
}

- (void)purchases:(RCPurchases *)purchases shouldPurchasePromoProduct:(SKProduct *)product
   defermentBlock:(RCDeferredPromotionalPurchaseBlock)makeDeferredPurchase
{
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

- (void (^)(NSDictionary *, RCErrorContainer *))getResponseCompletionBlock:(CDVInvokedUrlCommand *)command
{
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

- (void)sendOKForCommand:(CDVInvokedUrlCommand *)command messageAsArray:(nullable NSArray *)theMessage
{
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:theMessage];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (NSString *)platformFlavor {
    return @"cordova";
}

- (NSString *)platformFlavorVersion {
    return @"1.2.2";
}

@end

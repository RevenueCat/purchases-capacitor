//
//  Created by RevenueCat.
//  Copyright © 2019 RevenueCat. All rights reserved.
//

#import <Purchases/RCPurchases.h>
#import <PurchasesHybridCommon/PurchasesHybridCommon.h>
#import <Cordova/CDVPlugin.h>

@interface CDVPurchasesPlugin : CDVPlugin
{
}

- (void)setupPurchases:(CDVInvokedUrlCommand *)command;
- (void)setAllowSharingStoreAccount:(CDVInvokedUrlCommand *)command;
- (void)addAttributionData:(CDVInvokedUrlCommand *)command;
- (void)getOfferings:(CDVInvokedUrlCommand *)command;
- (void)getProductInfo:(CDVInvokedUrlCommand *)command;
- (void)purchaseProduct:(CDVInvokedUrlCommand *)command;
- (void)purchasePackage:(CDVInvokedUrlCommand *)command;
- (void)restoreTransactions:(CDVInvokedUrlCommand *)command;
- (void)getAppUserID:(CDVInvokedUrlCommand *)command;
- (void)createAlias:(CDVInvokedUrlCommand *)command;
- (void)identify:(CDVInvokedUrlCommand *)command;
- (void)reset:(CDVInvokedUrlCommand *)command;
- (void)setupShouldPurchasePromoProductCallback:(CDVInvokedUrlCommand *)command;
- (void)setDebugLogsEnabled:(CDVInvokedUrlCommand *)command;
- (void)getPurchaserInfo:(CDVInvokedUrlCommand *)command;
- (void)syncPurchases:(CDVInvokedUrlCommand *)command;
- (void)setAutomaticAppleSearchAdsAttributionCollection:(CDVInvokedUrlCommand *)command;
- (void)isAnonymous:(CDVInvokedUrlCommand *)command;
- (void)checkTrialOrIntroductoryPriceEligibility:(CDVInvokedUrlCommand *)command;
- (void)invalidatePurchaserInfoCache:(CDVInvokedUrlCommand *)command;
- (void)presentCodeRedemptionSheet:(CDVInvokedUrlCommand *)command;
- (void)setAttributes:(CDVInvokedUrlCommand *)command;
- (void)setEmail:(CDVInvokedUrlCommand *)command;
- (void)setPhoneNumber:(CDVInvokedUrlCommand *)command;
- (void)setDisplayName:(CDVInvokedUrlCommand *)command;
- (void)setPushToken:(CDVInvokedUrlCommand *)command;
- (void)setProxyURLString:(CDVInvokedUrlCommand *)command;
- (void)setAdjustID:(CDVInvokedUrlCommand *)command;
- (void)setAppsflyerID:(CDVInvokedUrlCommand *)command;
- (void)setFBAnonymousID:(CDVInvokedUrlCommand *)command;
- (void)setMparticleID:(CDVInvokedUrlCommand *)command;
- (void)setOnesignalID:(CDVInvokedUrlCommand *)command;
- (void)setMediaSource:(CDVInvokedUrlCommand *)command;
- (void)setCampaign:(CDVInvokedUrlCommand *)command;
- (void)setAdGroup:(CDVInvokedUrlCommand *)command;
- (void)setAd:(CDVInvokedUrlCommand *)command;
- (void)setKeyword:(CDVInvokedUrlCommand *)command;
- (void)setCreative:(CDVInvokedUrlCommand *)command;
- (void)collectDeviceIdentifiers:(CDVInvokedUrlCommand *)command;
- (void)canMakePayments:(CDVInvokedUrlCommand *)command;
@end

## 2.1.0

- iOS: 
    - Added a new method `setSimulatesAskToBuyInSandbox`, that allows developers to test deferred purchases easily.
- Bumped purchases-hybrid-common to 1.6.1 [Changelog here](https://github.com/RevenueCat/purchases-hybrid-common/releases/1.6.1)
- Bumped purchases-ios to 3.10.6 [Changelog here](https://github.com/RevenueCat/purchases-ios/releases/3.10.6)
- Bumped purchases-android to 4.0.4 [Changelog here](https://github.com/RevenueCat/purchases-hybrid-common/releases/4.0.4)
    https://github.com/RevenueCat/cordova-plugin-purchases/pull/76

### 2.0.0

- removes deprecated `makePurchase`, replaced by `purchaseProduct`
 - iOS: 
     - added new method, `syncPurchases`, that enables syncing the purchases in the local receipt with the backend without risking a password prompt. The method was already available on Android.
     - added a new method, `presentCodeRedemptionSheet`, for offer codes redemption.
- Bumped `purchases-hybrid-common` to 1.5.0 [Changelog here](https://github.com/RevenueCat/purchases-hybrid-common/releases/1.5.0)
- Bumped `purchases-ios` to 3.9.2 [Changelog here](https://github.com/RevenueCat/purchases-ios/releases/3.9.2)
- Bumped `purchases-android` to 4.0.1 [Changelog here](https://github.com/RevenueCat/purchases-android/releases/4.0.1)

### 1.3.2

- Bumped `purchases-hybrid-common` to 1.4.5 [Changelog here](https://github.com/RevenueCat/purchases-hybrid-common/releases/1.4.5)
- Bumped `purchases-ios` to 3.7.5 [Changelog here](https://github.com/RevenueCat/purchases-ios/releases/3.7.5)
- Updates docs for subscriber attributes https://github.com/RevenueCat/cordova-plugin-purchases/pull/57

### 1.3.1

- Bumped `purchases-hybrid-common` to 1.4.4 [Changelog here](https://github.com/RevenueCat/purchases-hybrid-common/releases/1.4.4)
- Bumped `purchases-android` to 3.5.2 [Changelog here](https://github.com/RevenueCat/purchases-android/releases/3.5.2)

### 1.3.0

- Attribution V2:
    - Deprecated `addAttribution` in favor of `setAdjustId`, `setAppsflyerId`, `setFbAnonymousId`, `setMparticleId`.
    - Added support for OneSignal via `setOnesignalId`
    - Added `setMediaSource`, `setCampaign`, `setAdGroup`, `setAd`, `setKeyword`, `setCreative`, and `collectDeviceIdentifiers`
         https://github.com/RevenueCat/purchases-android/pull/184
- Bumped `purchases-hybrid-common` to 1.4.3 [Changelog here](https://github.com/RevenueCat/purchases-hybrid-common/releases/1.4.3)
- Bumped `purchases-ios` to 3.7.2 [Changelog here](https://github.com/RevenueCat/purchases-ios/releases/3.7.2)
- Bumped `purchases-android` to 3.5.0 [Changelog here](https://github.com/RevenueCat/purchases-android/releases/3.5.0)
- Added `PurchasesPlugin.swift` to prevent compiling issues on objective-c projects
- removed `use-frameworks` setting in the sample app to fix linking issues

## 1.2.2

- Adds missing import.

## 1.2.1

- Removed lambda from Android code (https://github.com/RevenueCat/cordova-plugin-purchases/pull/51)

## 1.2.0

- Bumped iOS to 3.4.0 [Changelog here](https://github.com/RevenueCat/purchases-ios/releases)
- Bumped Android to 3.2.0 [Changelog here](https://github.com/RevenueCat/purchases-android/releases)
- Added managementURL to PurchaserInfo
- Added setProxyURL
- Added originalPurchaseDate to PurchaserInfo
- Adds new headers for platformFlavor and platformFlavorVersion
- Adds userDefaultsSuiteName as an option when setting up the SDK
- Linked TS Types (https://github.com/RevenueCat/cordova-plugin-purchases/pull/42)
- Moved iOS common files to use pod dependencies (https://github.com/RevenueCat/cordova-plugin-purchases/pull/39)
- Moved Android common files to use gradle maven dependency (https://github.com/RevenueCat/cordova-plugin-purchases/pull/39)

## 1.1.0

- Adds an example project that shows how to set up an app with RevenueCat
    https://github.com/RevenueCat/cordova-plugin-purchases/pull/29
- Adds Subscriber Attributes, which allow developers to store additional, structured information
for a user in RevenueCat. More info: https://docs.revenuecat.com/docs/user-attributes.
- Adds new method to invalidate the purchaser info cache, useful when promotional purchases are granted from outside the app.
    https://github.com/RevenueCat/cordova-plugin-purchases/pull/32

## 1.0.5

- Adds `shouldPurchasePromoProduct`, which allows the app to decide how and when to handle promotional purchases made by users directly through the App Store (https://github.com/RevenueCat/cordova-plugin-purchases/pull/25). 
- Fixes some JSDocs and export types https://github.com/RevenueCat/cordova-plugin-purchases/pull/26. 

## 1.0.4

- Adds missing types

## 1.0.3

- Renames `introEligibilityStatus` to `status` in `IntroEligibility`

## 1.0.2

- Adds `checkTrialOrIntroductoryPriceEligibility`. Note that Android always returns INTRO_ELIGIBILITY_STATUS_UNKNOWN.
- Updates iOS to 3.0.1 and Android to 3.0.4

## 1.0.1

- Updates Android to 3.0.3

## 1.0.0

- Support for new Offerings system.
- Deprecates `makePurchase` methods. Replaces with `purchasePackage`
- Deprecates `getEntitlements` method. Replaces with `getOfferings`
- See our migration guide for more info: https://docs.revenuecat.com/v3.0/docs/offerings-migration
- Updates to BillingClient 2.0.3. If finishTransactions is set to false (or observerMode is true when configuring the SDK), 
this SDK won't acknowledge any purchase and you have to do it yourself.
- Adds proration mode support on upgrades/downgrades
- Adds more PurchaserInfo missing properties. `activeEntitlements`, `expirationsForActiveEntitlements` 
and `purchaseDatesForActiveEntitlements` have been removed from PurchaserInfo
- `intro_price`, `intro_price_period_number_of_units` and `intro_price_cycles` are a number now or null instead of empty
 strings, `intro_price_period_unit` can also be null.
- Added Typescript types
- New identity changes:
  - The .createAlias() method is no longer required, use .identify() instead
  - .identify() will create an alias if being called from an anonymous ID generated by RevenueCat
  - Added an isAnonymous property to Purchases.sharedInstance
  - Improved offline use
  
## 0.3.2

- Fixes EntitlementInfo's `expirationDate` in iOS.

## 0.3.1

- Fixes crash when there's a trial period and not an introductory price on Android.

## 0.3.0

- Deprecates activeEntitlements in PurchaserInfo and adds entitlements object to RCPurchaserInfo. For more info check out https://docs.revenuecat.com/docs/purchaserinfo
- Fixes trial info being lost in Android. Access intro_price in the product information to get information around the trial period.
- Fixes exception when trying to purchase a product that doesn't exist.

## 0.2.1

- Fixes a bug when normalizing intro_price_period.
- **BREAKING_CHANGE** All `intro_price` related fields in the product are strings, or empty strings if inexistent, in both iOS and Android. There were some discrepancies between platforms released in https://github.com/RevenueCat/cordova-plugin-purchases/releases/tag/0.2.0.

## 0.2.0

- Upgrades iOS SDK to https://github.com/RevenueCat/purchases-ios/releases/tag/2.5.0 and Android to https://github.com/RevenueCat/purchases-android/releases/tag/2.3.0.
- Adds Facebook as supported attribution network.
- DEPRECATION: automaticAttributionCollection is now deprecated in favor of automaticAppleSearchAdsAttributionCollection since it's a more clear name.
- Adds introductory pricing to the iOS product.

## 0.1.2

- Compile javascript down to ES5 for better support

## 0.1.1

- Fixes Android `makePurchase` errors
- Fixes `readable_error_code` in iOS

## 0.1.0

- Updates iOS SDK to 2.3.0. Check out the changelog for a full list of changes https://github.com/RevenueCat/purchases-ios/releases/tag/2.3.0
- Updates Android SDK to 2.2.2. Check out the changelog for a full list of changes https://github.com/RevenueCat/purchases-android/releases/tag/2.2.2
- ** BREAKING CHANGE ** makePurchase parameter oldSKUs is not an array anymore, it only accepts a string now. This is due to changes in the BillingClient.
- AddAttributionData can be called before the SDK has been setup. A network user identifier can be send to the addAttribution function, replacing the previous rc_appsflyer_id parameter.
- Adds an optional configuration boolean observerMode. This will set the value of finishTransactions at configuration time.

### Android only:

- addAttribution will automatically add the rc_gps_adid parameter.
- ** ANDROID BREAKING CHANGE ** Call syncTransactions to send purchases information to RevenueCat after any restore or purchase if you are using the SDK in observerMode. See our guide on Migrating Subscriptions for more information on syncTransactions: https://docs.revenuecat.com/docs/migrating-existing-subscriptions

### iOS only

- addAttribution will automatically add the rc_idfa and rc_idfv parameters if the AdSupport and UIKit frameworks are included, respectively.
- Apple Search Ad attribution can be automatically collected by setting the automaticAttributionCollection boolean to true before the SDK is configured.
- Other bugfixes

## 0.0.8

- Updates iOS SDK to 2.1.1

## 0.0.7

- Fixes exception on iOS when sending an error

## 0.0.6

- Fixes errors in Android not being sent as int
- Fixes crash when underlyingErrorMessage is missing

## 0.0.5

- Updates versions to 2.1.0 with the new error handling.
- **Breaking** change, the errors have changed and now return an underlyingErrorMessage instead of the domain.
- Removes the preinstall hook that was causing errors in Windows. 0.0.4 version was broken for some. The iOS framework will be included in the repo from now on.
- **Breaking** the error callback of makePurchase now returns an error and a boolean indicating if the user cancelled.

## 0.0.4

- Fixes windows by skipping installation of iOS download script if not building for iOS.

## 0.0.3

- Removes `onDestroy` Android's Activity lifecycle hook since it was closing the instance.

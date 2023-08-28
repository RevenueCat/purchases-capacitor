# V6 API Migration Guide

This release is the first official release after the transfer of the plugin from CapGo to RevenueCat's organization.

After this transfer, many changes were made to match RevenueCat's official API.

Additionally, this latest release updates the SDK to use BillingClient 5. This version of BillingClient brings an entire new
subscription model which has resulted in large changes across the entire SDK.

## Package rename

The package has been renamed. Now, in order to install the package, you need to do
`npm install @revenuecat/purchases-capacitor`. If you were using the previous package, you need to uninstall it first,
then install the new one:
```
npm uninstall @capgo/capacitor-purchases
npm install @revenuecat/purchases-capacitor
npx cap sync
```

## Updated Code References

This migration guide has detailed class, property, and method changes.

See [Android Native - 5.x to 6.x Migration](https://www.revenuecat.com/docs/android-native-5x-to-6x-migration) for a
more thorough explanation of the new Google subscription model announced with BillingClient 5 and how to take advantage of it in V6.

### Plugin rename

Before, the plugin name was `CapacitorPurchases`. Now, it's been renamed
to `Purchases`. That means previously you might call `CapacitorPurchases.logIn(...)`, now you need
to call `Purchases.logIn(...)`.

### Modified plugin methods
| Previous                                                                                                                                                                           | New                                                                                                                                                                                                              |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `setup(data: {apiKey: string, appUserID?: string, observerMode?: boolean, enableAdServicesAttribution?: boolean, collectDeviceIdentifiers?: boolean}: Promise<void>;`              | <ul><li>`configure(configuration: PurchasesConfiguration): Promise<void>;`</li><li>`enableAdServicesAttributionTokenCollection(): Promise<void>;`</li><li>`collectDeviceIdentifiers(): Promise<void>;`</li></ul> |
| `addListener(eventName: "purchasesUpdate", listenerFunc: (data: {purchases: Package, customerInfo: CustomerInfo}) => void): Promise<PluginListenerHandle> & PluginListenerHandle;` | `addCustomerInfoUpdateListener(customerInfoUpdateListener: CustomerInfoUpdateListener): Promise<PurchasesCallbackId>;`                                                                                           |
| `getOfferings(): Promise<{ offerings: Offerings }>;`                                                                                                                               | `getOfferings(): Promise<PurchasesOfferings>;`                                                                                                                                                                   |
| `purchasePackage(data: {identifier: string, offeringIdentifier: string, oldSKU?: string \| null}): Promise<{ customerInfo: CustomerInfo }>;`                                       | `purchasePackage(options: PurchasePackageOptions): Promise<MakePurchaseResult>;`                                                                                                                                 |
| `logIn(data: { appUserID: string }): Promise<LogInResult>;`                                                                                                                        | `logIn(options: { appUserID: string }): Promise<LogInResult>;`                                                                                                                                                   |
| `setDebugLogsEnabled(data: { enabled: boolean }): Promise<void>;`                                                                                                                  | `setLogLevel(options: { level: LOG_LEVEL }): Promise<void>;`                                                                                                                                                     |

Check full documentation in the [README](../README.md)

### New plugin methods
| New method                                                                                                                                           | 
|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `setFinishTransactions(options: { finishTransactions: boolean }): Promise<void>;`                                                                    |
| `setSimulatesAskToBuyInSandbox(options: { simulatesAskToBuyInSandbox: boolean }): Promise<void>;`                                                    |
| `removeCustomerInfoUpdateListener(listenerToRemove: PurchasesCallbackId): Promise<{ wasRemoved: boolean }>;`                                         |
| `getProducts(options: GetProductOptions): Promise<{ products: PurchasesStoreProduct[] }>;`                                                           |
| `purchaseStoreProduct(options: PurchaseStoreProductOptions): Promise<MakePurchaseResult>;`                                                           |
| `purchaseDiscountedProduct(options: PurchaseDiscountedProductOptions): Promise<MakePurchaseResult>;`                                                 |
| `purchaseSubscriptionOption(options: PurchaseSubscriptionOptionOptions): Promise<MakePurchaseResult>;`                                               |
| `purchaseDiscountedPackage(options: PurchaseDiscountedPackageOptions): Promise<MakePurchaseResult>;`                                                 |
| `getAppUserID(): Promise<{ appUserID: string }>;`                                                                                                    | 
| `setLogHandler(logHandler: LogHandler): Promise<void>;`                                                                                              |
| `syncPurchases(): Promise<void>;`                                                                                                                    |
| `syncObserverModeAmazonPurchase(options: SyncObserverModeAmazonPurchaseOptions): Promise<void>;`                                                     |
| `isAnonymous(): Promise<{ isAnonymous: boolean }>;`                                                                                                  |
| `checkTrialOrIntroductoryPriceEligibility(options: { productIdentifiers: string[] }): Promise<{ [productId: string]: IntroEligibility }>;`           |
| `getPromotionalOffer(options: GetPromotionalOfferOptions): Promise<PurchasesPromotionalOffer \| undefined>;`                                         |
| `invalidateCustomerInfoCache(): Promise<void>;`                                                                                                      |
| `presentCodeRedemptionSheet(): Promise<void>;`                                                                                                       |
| `setEmail(options: { email: string \| null }): Promise<void>;`                                                                                       |
| `setPhoneNumber(options: { phoneNumber: string \| null }): Promise<void>;`                                                                           |
| `setDisplayName(options: { displayName: string \| null }): Promise<void>;`                                                                           |
| `setPushToken(options: { pushToken: string \| null }): Promise<void>;`                                                                               |
| `setProxyURL(options: { url: string }): Promise<void>;`                                                                                              |
| `setAdjustID(options: { adjustID: string \| null }): Promise<void>;`                                                                                 |
| `setAppsflyerID(options: { appsflyerID: string \| null }): Promise<void>;`                                                                           |
| `setFBAnonymousID(options: { fbAnonymousID: string \| null }): Promise<void>;`                                                                       |
| `setMparticleID(options: { mparticleID: string \| null }): Promise<void>;`                                                                           |
| `setCleverTapID(options: { cleverTapID: string \| null }): Promise<void>;`                                                                           |
| `setMixpanelDistinctID(options: { mixpanelDistinctID: string \| null }): Promise<void>;`                                                             |
| `setFirebaseAppInstanceID(options: { firebaseAppInstanceID: string \| null }): Promise<void>;`                                                       |
| `setOnesignalID(options: { onesignalID: string \| null }): Promise<void>;`                                                                           |
| `setAirshipChannelID(options: { airshipChannelID: string \| null }): Promise<void>;`                                                                 |
| `setMediaSource(options: { mediaSource: string \| null }): Promise<void>;`                                                                           |
| `setCampaign(options: { campaign: string \| null }): Promise<void>;`                                                                                 |
| `setAdGroup(options: { adGroup: string \| null }): Promise<void>;`                                                                                   |
| `setAd(options: { ad: string \| null }): Promise<void>;`                                                                                             |
| `setKeyword(options: { keyword: string \| null }): Promise<void>;`                                                                                   |
| `setCreative(options: { creative: string \| null }): Promise<void>;`                                                                                 |
| `canMakePayments(options?: { features?: BILLING_FEATURE[] }): Promise<{ canMakePayments: boolean }>;`                                                |
| `beginRefundRequestForActiveEntitlement(): Promise<{ refundRequestStatus: REFUND_REQUEST_STATUS }>;`                                                 |
| `beginRefundRequestForEntitlement(options: { entitlementInfo: PurchasesEntitlementInfo }): Promise<{ refundRequestStatus: REFUND_REQUEST_STATUS }>;` |
| `beginRefundRequestForProduct(options: { storeProduct: PurchasesStoreProduct }): Promise<{ refundRequestStatus: REFUND_REQUEST_STATUS }>;`           |
| `isConfigured(): Promise<{ isConfigured: boolean }>;`                                                                                                |

Check full documentation in the [README](../README.md)
    
### Removed plugin types
| Removed types                        |
|--------------------------------------|
| `ATTRIBUTION_NETWORK`                |
| `Error`                              |
| `SubscriptionPeriod`                 |

### Renamed plugin types
| Old type            | New type                        |
|---------------------|---------------------------------|
| `PURCHASE_TYPE`     | `PRODUCT_CATEGORY`              |
| `EntitlementInfo`   | `PurchasesEntitlementInfo`      |
| `EntitlementInfos`  | `PurchasesEntitlementInfos`     |
| `Offerings`         | `PurchasesOfferings`            |
| `Offering`          | `PurchasesOffering`             |
| `Package`           | `PurchasesPackage`              |
| `Product`           | `PurchasesStoreProduct`         |
| `UpgradeInfo`       | `GoogleProductChangeInfo`       |
| `SKProductDiscount` | `PurchasesStoreProductDiscount` |
| `Transaction`       | `PurchasesStoreTransaction`     |

### New plugin types
| New type                                |
|-----------------------------------------|
| `GetProductOptions`                     |
| `PurchaseStoreProductOptions`           |
| `PurchaseDiscountedProductOptions`      |
| `PurchasePackageOptions`                |
| `PurchaseDiscountedPackageOptions`      |
| `PurchaseSubscriptionOptionOptions`     |
| `SyncObserverModeAmazonPurchaseOptions` |
| `GetPromotionalOfferOptions`            |
| `PurchasesPromotionalOffer`             |
| `SubscriptionOption`                    |
| `PurchasesConfiguration`                |
| `MakePurchaseResult`                    |
| `CustomerInfoUpdateListener`            |
| `LOG_LEVEL`                             |
| `LogHandler`                            |
| `PricingPhase`                          |
| `Period`                                |
| `Price`                                 |
| `OFFER_PAYMENT_MODE`                    |
| `RECURRENCE_MODE`                       |
| `PERIOD_UNIT`                           |

### New enum values
| New enum values                                                             |
|-----------------------------------------------------------------------------|
| `PRORATION_MODE`.`IMMEDIATE_AND_CHARGE_FULL_PRICE`                          |
| `INTRO_ELIGIBILITY_STATUS`.`INTRO_ELIGIBILITY_STATUS_NO_INTRO_OFFER_EXISTS` |
| `PRODUCT_CATEGORY`.`UNKNOWN`                                                |

#### PurchasesStoreProduct changes
| PurchasesStoreProduct changes                                                   |
|---------------------------------------------------------------------------------|
| REMOVED `currencySymbol`                                                        |
| REMOVED `isFamilyShareable`                                                     |
| REMOVED `subscriptionGroupIdentifier`                                           |
| CHANGED `subscriptionPeriod` type from `SubscriptionPeriod` to `string \| null` |
| RENAMED `introductoryPrice` to `introPrice`                                     | 
| ADDED `productCategory`                                                         |
| ADDED `defaultOption`                                                           |
| ADDED `subscriptionOptions`                                                     |
| ADDED `presentedOfferingIdentifier`                                             |

##### Handling Free Trial and Intro Offers (Google Play-only)

`PurchasesStoreProduct` can now have multiple free trials and introductory offers. There is a `defaultOption` property on
`PurchasesStoreProduct` that will select the offer with the longest free trial period or the cheapest introductory offer.

If more control is needed, the free trial, intro offer, and other [SubscriptionOption]s can
be found through `subscriptionOptions`:

```typescript
const basePlan = storeProduct.subscriptionOptions?.filter((option) => { option.isBasePlan });
const defaultOption = storeProduct.defaultOption
const freeOffer = storeProduct.subscriptionOptions?.filter((option) => { !!option.freePhase });
const trialOffer = storeProduct.subscriptionOptions?.filter((option) => { !!option.introPhase });
```

#### Applying offers on a purchase (Google Play-only)
A `Package` or `StoreProduct` represents a duration of a subscription and contains all the ways to
purchase that duration -- any offers and its base plan. Each of these purchase options are `SubscriptionOption`s.
When passing a `Package` or `StoreProduct` to `purchase()`, the SDK will use the following logic to choose which
[SubscriptionOption] to purchase:
*   - Filters out offers with "rc-ignore-offer" tag
*   - Uses [SubscriptionOption] with the longest free trial or cheapest first phase
*   - Falls back to base plan

For more control, use `purchaseSubscriptionOption` with the desired `SubscriptionOption`.

### Reporting undocumented issues:

Feel free to file an issue! [New RevenueCat Issue](https://github.com/RevenueCat/purchases-capacitor/issues/new/).

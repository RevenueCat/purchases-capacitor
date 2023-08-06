# capacitor-purchases
  <a href="https://capgo.app/"><img src='https://raw.githubusercontent.com/Cap-go/capgo/main/assets/capgo_banner.png' alt='Capgo - Instant updates for capacitor'/></a>
  
<div align="center">
<h2><a href="https://capgo.app/">Check out: Capgo — live updates for capacitor</a></h2>
</div>

In-app Subscriptions Made Easy with RevenueCat SDK

RevenueCat is a third-party tool, who handle all difficulty for us is Free until $10,000 Revenue by month

Capacitor implementation with lastes RevenueCat SDK v4

RevenueCat:
<a href="https://www.appbrain.com/stats/libraries/details/revenuecat/revenuecat">
  <img src="https://www.appbrain.com/stats/libraries/shield/revenuecat.svg">
</a>

## Tutorial step by step

https://capgo.app/blog/in-app-purchases-capacitor/

## Install

```bash
npm install @capgo/capacitor-purchases
pnpm dlx cap sync
```

## Android
Add this to your android manifest `android/app/src/main/AndroidManifest.xml`
```xml
<uses-permission android:name="com.android.vending.BILLING"/>
```
### Variables

This plugin will use the following project variables (defined in your app's `variables.gradle` file):
- `$kotlinVersion` version of `org.jetbrains.kotlin:kotlin-stdlib-jdk7` (default: `1.7.21`)

If you have compilation issue `Duplicate class androidx.lifecycle.ViewModelLazy`
i found in this the solution who worked for me:
https://stackoverflow.com/questions/73406969/duplicate-class-androidx-lifecycle-viewmodellazy-found-in-modules-lifecycle-view

Add this
```
configurations {
    all {
        exclude group: 'androidx.lifecycle', module: 'lifecycle-runtime-ktx'
        exclude group: 'androidx.lifecycle', module: 'lifecycle-viewmodel-ktx'
    }
}
an
```
line 2 in file `android/app/build.gradle`
## Configuration

No configuration required for this plugin.

## Migration v2

getPurchaserInfo become getCustomerInfo
PurchaserInfo become CustomerInfo
restoreTransactions become restorePurchases

Read more about it here: https://github.com/RevenueCat/purchases-android/blob/main/migrations/v5-MIGRATION.md

## API

<docgen-index>

* [`setup(...)`](#setup)
* [`addListener('purchasesUpdate', ...)`](#addlistenerpurchasesupdate)
* [`getOfferings()`](#getofferings)
* [`purchasePackage(...)`](#purchasepackage)
* [`restorePurchases()`](#restorepurchases)
* [`setAttributes(...)`](#setattributes)
* [`logIn(...)`](#login)
* [`logOut()`](#logout)
* [`getCustomerInfo()`](#getcustomerinfo)
* [`setDebugLogsEnabled(...)`](#setdebuglogsenabled)
* [Interfaces](#interfaces)
* [Enums](#enums)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### setup(...)

```typescript
setup(data: { apiKey: string; appUserID?: string; observerMode?: boolean; enableAdServicesAttribution?: boolean; collectDeviceIdentifiers?: boolean; }) => Promise<void>
```

Sets up  with your API key and an app user id.

| Param      | Type                                                                                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`data`** | <code>{ apiKey: string; appUserID?: string; observerMode?: boolean; enableAdServicesAttribution?: boolean; collectDeviceIdentifiers?: boolean; }</code> |

--------------------


### addListener('purchasesUpdate', ...)

```typescript
addListener(eventName: "purchasesUpdate", listenerFunc: (data: { purchases: Package; customerInfo: CustomerInfo; }) => void) => Promise<PluginListenerHandle> & PluginListenerHandle
```

Called when partialResults set to true and result received

Provides partial result.

| Param              | Type                                                                                                                                   |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| **`eventName`**    | <code>'purchasesUpdate'</code>                                                                                                         |
| **`listenerFunc`** | <code>(data: { purchases: <a href="#package">Package</a>; customerInfo: <a href="#customerinfo">CustomerInfo</a>; }) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt; & <a href="#pluginlistenerhandle">PluginListenerHandle</a></code>

**Since:** 2.0.2

--------------------


### getOfferings()

```typescript
getOfferings() => Promise<{ offerings: Offerings; }>
```

Gets the <a href="#offerings">Offerings</a> configured in the RevenueCat dashboard

**Returns:** <code>Promise&lt;{ offerings: <a href="#offerings">Offerings</a>; }&gt;</code>

--------------------


### purchasePackage(...)

```typescript
purchasePackage(data: { identifier: string; offeringIdentifier: string; oldSKU?: string | null; }) => Promise<{ customerInfo: CustomerInfo; }>
```

Make a purchase

| Param      | Type                                                                                      |
| ---------- | ----------------------------------------------------------------------------------------- |
| **`data`** | <code>{ identifier: string; offeringIdentifier: string; oldSKU?: string \| null; }</code> |

**Returns:** <code>Promise&lt;{ customerInfo: <a href="#customerinfo">CustomerInfo</a>; }&gt;</code>

--------------------


### restorePurchases()

```typescript
restorePurchases() => Promise<{ customerInfo: CustomerInfo; }>
```

Restores a user's previous  and links their appUserIDs to any user's also using those .

**Returns:** <code>Promise&lt;{ customerInfo: <a href="#customerinfo">CustomerInfo</a>; }&gt;</code>

--------------------


### setAttributes(...)

```typescript
setAttributes(data: { attributes: { [key: string]: string | null; }; }) => Promise<void>
```

Subscriber attributes are useful for storing additional, structured information on a user.
Since attributes are writable using a public key they should not be used for
managing secure or sensitive information such as subscription status, coins, etc.

Key names starting with "$" are reserved names used by RevenueCat. For a full list of key
restrictions refer to our guide: https://docs.revenuecat.com/docs/subscriber-attributes

| Param      | Type                                                             |
| ---------- | ---------------------------------------------------------------- |
| **`data`** | <code>{ attributes: { [key: string]: string \| null; }; }</code> |

--------------------


### logIn(...)

```typescript
logIn(data: { appUserID: string; }) => Promise<LogInResult>
```

This function will logIn the current user with an appUserID. Typically this would be used after a log in
to identify a user without calling configure.

| Param      | Type                                |
| ---------- | ----------------------------------- |
| **`data`** | <code>{ appUserID: string; }</code> |

**Returns:** <code>Promise&lt;<a href="#loginresult">LogInResult</a>&gt;</code>

--------------------


### logOut()

```typescript
logOut() => Promise<{ customerInfo: CustomerInfo; }>
```

Logs out the  client clearing the saved appUserID. This will generate a random user id and save it in the cache.
If the current user is already anonymous, this will produce a Error.

**Returns:** <code>Promise&lt;{ customerInfo: <a href="#customerinfo">CustomerInfo</a>; }&gt;</code>

--------------------


### getCustomerInfo()

```typescript
getCustomerInfo() => Promise<{ customerInfo: CustomerInfo; }>
```

Gets the current purchaser info. This call will return the cached purchaser info unless the cache is stale, in which case,
it will make a network call to retrieve it from the servers.

**Returns:** <code>Promise&lt;{ customerInfo: <a href="#customerinfo">CustomerInfo</a>; }&gt;</code>

--------------------


### setDebugLogsEnabled(...)

```typescript
setDebugLogsEnabled(data: { enabled: boolean; }) => Promise<void>
```

Enables/Disables debugs logs

| Param      | Type                               |
| ---------- | ---------------------------------- |
| **`data`** | <code>{ enabled: boolean; }</code> |

--------------------


### Interfaces


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


#### Package

Contains information about the product available for the user to purchase.
For more info see https://docs.revenuecat.com/docs/entitlements

| Prop                     | Type                                                  | Description                                                                               |
| ------------------------ | ----------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **`identifier`**         | <code>string</code>                                   | Unique identifier for this package. Can be one a predefined package type or a custom one. |
| **`packageType`**        | <code><a href="#package_type">PACKAGE_TYPE</a></code> | <a href="#package">Package</a> type for the product. Will be one of [PACKAGE_TYPE].       |
| **`product`**            | <code><a href="#product">Product</a></code>           | <a href="#product">Product</a> assigned to this package.                                  |
| **`offeringIdentifier`** | <code>string</code>                                   | <a href="#offering">Offering</a> this package belongs to.                                 |


#### Product

| Prop                              | Type                                                                    | Description                                                              |
| --------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **`identifier`**                  | <code>string</code>                                                     | <a href="#product">Product</a> Id.                                       |
| **`description`**                 | <code>string</code>                                                     | Description of the product.                                              |
| **`title`**                       | <code>string</code>                                                     | Title of the product.                                                    |
| **`price`**                       | <code>number</code>                                                     | Price of the product in the local currency.                              |
| **`priceString`**                 | <code>string</code>                                                     | Formatted price of the item, including its currency sign, such as €3.99. |
| **`currencyCode`**                | <code>string</code>                                                     | Currency code for price and original price.                              |
| **`currencySymbol`**              | <code>string</code>                                                     | Currency symbol for price and original price.                            |
| **`isFamilyShareable`**           | <code>boolean</code>                                                    | Boolean indicating if the product is sharable with family                |
| **`subscriptionGroupIdentifier`** | <code>string</code>                                                     | Group identifier for the product.                                        |
| **`subscriptionPeriod`**          | <code><a href="#subscriptionperiod">SubscriptionPeriod</a></code>       | The <a href="#product">Product</a> subcription group identifier.         |
| **`introductoryPrice`**           | <code><a href="#skproductdiscount">SKProductDiscount</a> \| null</code> | The <a href="#product">Product</a> introductory Price.                   |
| **`discounts`**                   | <code>SKProductDiscount[]</code>                                        | The <a href="#product">Product</a> discounts list.                       |


#### SubscriptionPeriod

| Prop                | Type                | Description                             |
| ------------------- | ------------------- | --------------------------------------- |
| **`numberOfUnits`** | <code>number</code> | The Subscription Period number of unit. |
| **`unit`**          | <code>number</code> | The Subscription Period unit.           |


#### SKProductDiscount

| Prop                     | Type                                                              | Description                                                              |
| ------------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **`identifier`**         | <code>string</code>                                               | The <a href="#product">Product</a> discount identifier.                  |
| **`type`**               | <code>number</code>                                               | The <a href="#product">Product</a> discount type.                        |
| **`price`**              | <code>number</code>                                               | The <a href="#product">Product</a> discount price.                       |
| **`priceString`**        | <code>string</code>                                               | Formatted price of the item, including its currency sign, such as €3.99. |
| **`currencySymbol`**     | <code>string</code>                                               | The <a href="#product">Product</a> discount currency symbol.             |
| **`currencyCode`**       | <code>string</code>                                               | The <a href="#product">Product</a> discount currency code.               |
| **`paymentMode`**        | <code>number</code>                                               | The <a href="#product">Product</a> discount paymentMode.                 |
| **`numberOfPeriods`**    | <code>number</code>                                               | The <a href="#product">Product</a> discount number Of Periods.           |
| **`subscriptionPeriod`** | <code><a href="#subscriptionperiod">SubscriptionPeriod</a></code> | The <a href="#product">Product</a> discount subscription period.         |


#### CustomerInfo

| Prop                                 | Type                                                          | Description                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------ | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`entitlements`**                   | <code><a href="#entitlementinfos">EntitlementInfos</a></code> | Entitlements attached to this purchaser info                                                                                                                                                                                                                                                                                                     |
| **`activeSubscriptions`**            | <code>[string]</code>                                         | Set of active subscription skus                                                                                                                                                                                                                                                                                                                  |
| **`allPurchasedProductIdentifiers`** | <code>[string]</code>                                         | Set of purchased skus, active and inactive                                                                                                                                                                                                                                                                                                       |
| **`nonSubscriptionTransactions`**    | <code>Transaction[]</code>                                    | Returns all the non-subscription a user has made. The are ordered by purchase date in ascending order.                                                                                                                                                                                                                                           |
| **`latestExpirationDate`**           | <code>string \| null</code>                                   | The latest expiration date of all purchased skus                                                                                                                                                                                                                                                                                                 |
| **`firstSeen`**                      | <code>string</code>                                           | The date this user was first seen in RevenueCat.                                                                                                                                                                                                                                                                                                 |
| **`originalAppUserId`**              | <code>string</code>                                           | The original App User Id recorded for this user.                                                                                                                                                                                                                                                                                                 |
| **`requestDate`**                    | <code>string</code>                                           | Date when this info was requested                                                                                                                                                                                                                                                                                                                |
| **`originalApplicationVersion`**     | <code>string \| null</code>                                   | Returns the version number for the version of the application when the user bought the app. Use this for grandfathering users when migrating to subscriptions. This corresponds to the value of CFBundleVersion (in iOS) in the Info.plist file when the purchase was originally made. This is always null in Android                            |
| **`originalPurchaseDate`**           | <code>string \| null</code>                                   | Returns the purchase date for the version of the application when the user bought the app. Use this for grandfathering users when migrating to subscriptions.                                                                                                                                                                                    |
| **`managementURL`**                  | <code>string \| null</code>                                   | URL to manage the active subscription of the user. If this user has an active iOS subscription, this will point to the App Store, if the user has an active Play Store subscription it will point there. If there are no active subscriptions it will be null. If there are multiple for different platforms, it will point to the device store. |


#### EntitlementInfos

Contains all the entitlements associated to the user.

| Prop         | Type                                                                            | Description                                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`all`**    | <code>{ [key: string]: <a href="#entitlementinfo">EntitlementInfo</a>; }</code> | Map of all <a href="#entitlementinfo">EntitlementInfo</a> (`PurchasesEntitlementInfo`) objects (active and inactive) keyed by entitlement identifier. |
| **`active`** | <code>{ [key: string]: <a href="#entitlementinfo">EntitlementInfo</a>; }</code> | Map of active <a href="#entitlementinfo">EntitlementInfo</a> (`PurchasesEntitlementInfo`) objects keyed by entitlement identifier.                    |


#### EntitlementInfo

The <a href="#entitlementinfo">EntitlementInfo</a> object gives you access to all of the information about the status of a user entitlement.

| Prop                         | Type                        | Description                                                                                                                                                       |
| ---------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`identifier`**             | <code>string</code>         | The entitlement identifier configured in the RevenueCat dashboard                                                                                                 |
| **`isActive`**               | <code>boolean</code>        | True if the user has access to this entitlement                                                                                                                   |
| **`willRenew`**              | <code>boolean</code>        | True if the underlying subscription is set to renew at the end of the billing period (expirationDate). Will always be True if entitlement is for lifetime access. |
| **`periodType`**             | <code>string</code>         | The last period type this entitlement was in. Either: NORMAL, INTRO, TRIAL.                                                                                       |
| **`latestPurchaseDate`**     | <code>string</code>         | The latest purchase or renewal date for the entitlement.                                                                                                          |
| **`originalPurchaseDate`**   | <code>string</code>         | The first date this entitlement was purchased.                                                                                                                    |
| **`expirationDate`**         | <code>string \| null</code> | The expiration date for the entitlement, can be `null` for lifetime access. If the `periodType` is `trial`, this is the trial expiration date.                    |
| **`store`**                  | <code>string</code>         | The store where this entitlement was unlocked from. Either: appStore, macAppStore, playStore, stripe, promotional, unknownStore                                   |
| **`productIdentifier`**      | <code>string</code>         | The product identifier that unlocked this entitlement                                                                                                             |
| **`isSandbox`**              | <code>boolean</code>        | False if this entitlement is unlocked via a production purchase                                                                                                   |
| **`unsubscribeDetectedAt`**  | <code>string \| null</code> | The date an unsubscribe was detected. Can be `null`.                                                                                                              |
| **`billingIssueDetectedAt`** | <code>string \| null</code> | The date a billing issue was detected. Can be `null` if there is no billing issue or an issue has been resolved                                                   |


#### Transaction

| Prop                        | Type                | Description                                                        |
| --------------------------- | ------------------- | ------------------------------------------------------------------ |
| **`transactionIdentifier`** | <code>string</code> | RevenueCat Id associated to the transaction.                       |
| **`productIdentifier`**     | <code>string</code> | <a href="#product">Product</a> Id associated with the transaction. |
| **`purchaseDate`**          | <code>string</code> | Purchase date of the transaction in ISO 8601 format.               |


#### Offerings

Contains all the offerings configured in RevenueCat dashboard.
For more info see https://docs.revenuecat.com/docs/entitlements

| Prop          | Type                                                              | Description                                                                                          |
| ------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **`all`**     | <code>{ [key: string]: <a href="#offering">Offering</a>; }</code> | Map of all <a href="#offerings">Offerings</a> [PurchasesOffering] objects keyed by their identifier. |
| **`current`** | <code><a href="#offering">Offering</a> \| null</code>             | Current offering configured in the RevenueCat dashboard.                                             |


#### Offering

An offering is a collection of Packages (`PurchasesPackage`) available for the user to purchase.
For more info see https://docs.revenuecat.com/docs/entitlements

| Prop                    | Type                                                | Description                                                                    |
| ----------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------ |
| **`identifier`**        | <code>string</code>                                 | Unique identifier defined in RevenueCat dashboard.                             |
| **`serverDescription`** | <code>string</code>                                 | <a href="#offering">Offering</a> description defined in RevenueCat dashboard.  |
| **`availablePackages`** | <code>Package[]</code>                              | Array of <a href="#package">`Package`</a> objects available for purchase.      |
| **`lifetime`**          | <code><a href="#package">Package</a> \| null</code> | Lifetime package type configured in the RevenueCat dashboard, if available.    |
| **`annual`**            | <code><a href="#package">Package</a> \| null</code> | Annual package type configured in the RevenueCat dashboard, if available.      |
| **`sixMonth`**          | <code><a href="#package">Package</a> \| null</code> | Six month package type configured in the RevenueCat dashboard, if available.   |
| **`threeMonth`**        | <code><a href="#package">Package</a> \| null</code> | Three month package type configured in the RevenueCat dashboard, if available. |
| **`twoMonth`**          | <code><a href="#package">Package</a> \| null</code> | Two month package type configured in the RevenueCat dashboard, if available.   |
| **`monthly`**           | <code><a href="#package">Package</a> \| null</code> | Monthly package type configured in the RevenueCat dashboard, if available.     |
| **`weekly`**            | <code><a href="#package">Package</a> \| null</code> | Weekly package type configured in the RevenueCat dashboard, if available.      |


#### LogInResult

Holds the logIn result

| Prop               | Type                                                  | Description                                                                        |
| ------------------ | ----------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **`customerInfo`** | <code><a href="#customerinfo">CustomerInfo</a></code> | The Purchaser Info for the user.                                                   |
| **`created`**      | <code>boolean</code>                                  | True if the call resulted in a new user getting created in the RevenueCat backend. |


### Enums


#### PACKAGE_TYPE

| Members           | Value                      | Description                                                      |
| ----------------- | -------------------------- | ---------------------------------------------------------------- |
| **`UNKNOWN`**     | <code>"UNKNOWN"</code>     | A package that was defined with a custom identifier.             |
| **`CUSTOM`**      | <code>"CUSTOM"</code>      | A package that was defined with a custom identifier.             |
| **`LIFETIME`**    | <code>"LIFETIME"</code>    | A package configured with the predefined lifetime identifier.    |
| **`ANNUAL`**      | <code>"ANNUAL"</code>      | A package configured with the predefined annual identifier.      |
| **`SIX_MONTH`**   | <code>"SIX_MONTH"</code>   | A package configured with the predefined six month identifier.   |
| **`THREE_MONTH`** | <code>"THREE_MONTH"</code> | A package configured with the predefined three month identifier. |
| **`TWO_MONTH`**   | <code>"TWO_MONTH"</code>   | A package configured with the predefined two month identifier.   |
| **`MONTHLY`**     | <code>"MONTHLY"</code>     | A package configured with the predefined monthly identifier.     |
| **`WEEKLY`**      | <code>"WEEKLY"</code>      | A package configured with the predefined weekly identifier.      |

</docgen-api>

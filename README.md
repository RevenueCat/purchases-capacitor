# capacitor-purchases

In-app Subscriptions Made Easy with RevenueCat sdk

## Install

```bash
npm install capacitor-purchases
npx cap sync
```

## API

<docgen-index>

* [`setup(...)`](#setup)
* [`addListener('purchasesUpdate', ...)`](#addlistenerpurchasesupdate)
* [`getOfferings()`](#getofferings)
* [`purchasePackage(...)`](#purchasepackage)
* [`restoreTransactions()`](#restoretransactions)
* [`setAttributes(...)`](#setattributes)
* [`logIn(...)`](#login)
* [`logOut()`](#logout)
* [`getPurchaserInfo()`](#getpurchaserinfo)
* [`setDebugLogsEnabled(...)`](#setdebuglogsenabled)
* [Interfaces](#interfaces)
* [Enums](#enums)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### setup(...)

```typescript
setup(data: { apiKey: string; }) => Promise<void>
```

Sets up Purchases with your API key and an app user id.

| Param      | Type                             |
| ---------- | -------------------------------- |
| **`data`** | <code>{ apiKey: string; }</code> |

--------------------


### addListener('purchasesUpdate', ...)

```typescript
addListener(eventName: "purchasesUpdate", listenerFunc: (data: { purchases: PurchasesPackage; purchaserInfo: PurchaserInfo; }) => void) => Promise<PluginListenerHandle> & PluginListenerHandle
```

Called when partialResults set to true and result received

Provides partial result.

| Param              | Type                                                                                                                                                        |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`eventName`**    | <code>'purchasesUpdate'</code>                                                                                                                              |
| **`listenerFunc`** | <code>(data: { purchases: <a href="#purchasespackage">PurchasesPackage</a>; purchaserInfo: <a href="#purchaserinfo">PurchaserInfo</a>; }) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt; & <a href="#pluginlistenerhandle">PluginListenerHandle</a></code>

**Since:** 2.0.2

--------------------


### getOfferings()

```typescript
getOfferings() => Promise<{ offerings: PurchasesOfferings; }>
```

Gets the Offerings configured in the RevenueCat dashboard

**Returns:** <code>Promise&lt;{ offerings: <a href="#purchasesofferings">PurchasesOfferings</a>; }&gt;</code>

--------------------


### purchasePackage(...)

```typescript
purchasePackage(data: { aPackage: PurchasesPackage; upgradeInfo?: UpgradeInfo | null; }) => Promise<{ productIdentifier: string; purchaserInfo: PurchaserInfo; }>
```

Make a purchase

| Param      | Type                                                                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **`data`** | <code>{ aPackage: <a href="#purchasespackage">PurchasesPackage</a>; upgradeInfo?: <a href="#upgradeinfo">UpgradeInfo</a> \| null; }</code> |

**Returns:** <code>Promise&lt;{ productIdentifier: string; purchaserInfo: <a href="#purchaserinfo">PurchaserInfo</a>; }&gt;</code>

--------------------


### restoreTransactions()

```typescript
restoreTransactions() => Promise<{ purchaserInfo: PurchaserInfo; }>
```

Restores a user's previous purchases and links their appUserIDs to any user's also using those purchases.

**Returns:** <code>Promise&lt;{ purchaserInfo: <a href="#purchaserinfo">PurchaserInfo</a>; }&gt;</code>

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
logOut() => Promise<{ purchaserInfo: PurchaserInfo; }>
```

Logs out the Purchases client clearing the saved appUserID. This will generate a random user id and save it in the cache.
If the current user is already anonymous, this will produce a PurchasesError.

**Returns:** <code>Promise&lt;{ purchaserInfo: <a href="#purchaserinfo">PurchaserInfo</a>; }&gt;</code>

--------------------


### getPurchaserInfo()

```typescript
getPurchaserInfo() => Promise<{ purchaserInfo: PurchaserInfo; }>
```

Gets the current purchaser info. This call will return the cached purchaser info unless the cache is stale, in which case,
it will make a network call to retrieve it from the servers.

**Returns:** <code>Promise&lt;{ purchaserInfo: <a href="#purchaserinfo">PurchaserInfo</a>; }&gt;</code>

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


#### PurchasesPackage

Contains information about the product available for the user to purchase.
For more info see https://docs.revenuecat.com/docs/entitlements

| Prop                     | Type                                                          | Description                                                                               |
| ------------------------ | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **`identifier`**         | <code>string</code>                                           | Unique identifier for this package. Can be one a predefined package type or a custom one. |
| **`packageType`**        | <code><a href="#package_type">PACKAGE_TYPE</a></code>         | Package type for the product. Will be one of [PACKAGE_TYPE].                              |
| **`product`**            | <code><a href="#purchasesproduct">PurchasesProduct</a></code> | Product assigned to this package.                                                         |
| **`offeringIdentifier`** | <code>string</code>                                           | Offering this package belongs to.                                                         |


#### PurchasesProduct

| Prop                                     | Type                        | Description                                                                                                |
| ---------------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **`identifier`**                         | <code>string</code>         | Product Id.                                                                                                |
| **`description`**                        | <code>string</code>         | Description of the product.                                                                                |
| **`title`**                              | <code>string</code>         | Title of the product.                                                                                      |
| **`price`**                              | <code>number</code>         | Price of the product in the local currency.                                                                |
| **`price_string`**                       | <code>string</code>         | Formatted price of the item, including its currency sign, such as €3.99.                                   |
| **`currency_code`**                      | <code>string</code>         | Currency code for price and original price.                                                                |
| **`intro_price`**                        | <code>number \| null</code> | Introductory price of a subscription in the local currency.                                                |
| **`intro_price_string`**                 | <code>string \| null</code> | Formatted introductory price of a subscription, including its currency sign, such as €3.99.                |
| **`intro_price_period`**                 | <code>string \| null</code> | Billing period of the introductory price, specified in ISO 8601 format.                                    |
| **`intro_price_cycles`**                 | <code>number \| null</code> | Number of subscription billing periods for which the user will be given the introductory price, such as 3. |
| **`intro_price_period_unit`**            | <code>string \| null</code> | Unit for the billing period of the introductory price, can be DAY, WEEK, MONTH or YEAR.                    |
| **`intro_price_period_number_of_units`** | <code>number \| null</code> | Number of units for the billing period of the introductory price.                                          |


#### PurchaserInfo

| Prop                                 | Type                                                                            | Description                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`entitlements`**                   | <code><a href="#purchasesentitlementinfos">PurchasesEntitlementInfos</a></code> | Entitlements attached to this purchaser info                                                                                                                                                                                                                                                                                                     |
| **`activeSubscriptions`**            | <code>[string]</code>                                                           | Set of active subscription skus                                                                                                                                                                                                                                                                                                                  |
| **`allPurchasedProductIdentifiers`** | <code>[string]</code>                                                           | Set of purchased skus, active and inactive                                                                                                                                                                                                                                                                                                       |
| **`nonSubscriptionTransactions`**    | <code>PurchasesTransaction[]</code>                                             | Returns all the non-subscription purchases a user has made. The purchases are ordered by purchase date in ascending order.                                                                                                                                                                                                                       |
| **`latestExpirationDate`**           | <code>string \| null</code>                                                     | The latest expiration date of all purchased skus                                                                                                                                                                                                                                                                                                 |
| **`firstSeen`**                      | <code>string</code>                                                             | The date this user was first seen in RevenueCat.                                                                                                                                                                                                                                                                                                 |
| **`originalAppUserId`**              | <code>string</code>                                                             | The original App User Id recorded for this user.                                                                                                                                                                                                                                                                                                 |
| **`requestDate`**                    | <code>string</code>                                                             | Date when this info was requested                                                                                                                                                                                                                                                                                                                |
| **`allExpirationDates`**             | <code>{ [key: string]: string \| null; }</code>                                 | Map of skus to expiration dates                                                                                                                                                                                                                                                                                                                  |
| **`allPurchaseDates`**               | <code>{ [key: string]: string \| null; }</code>                                 | Map of skus to purchase dates                                                                                                                                                                                                                                                                                                                    |
| **`originalApplicationVersion`**     | <code>string \| null</code>                                                     | Returns the version number for the version of the application when the user bought the app. Use this for grandfathering users when migrating to subscriptions. This corresponds to the value of CFBundleVersion (in iOS) in the Info.plist file when the purchase was originally made. This is always null in Android                            |
| **`originalPurchaseDate`**           | <code>string \| null</code>                                                     | Returns the purchase date for the version of the application when the user bought the app. Use this for grandfathering users when migrating to subscriptions.                                                                                                                                                                                    |
| **`managementURL`**                  | <code>string \| null</code>                                                     | URL to manage the active subscription of the user. If this user has an active iOS subscription, this will point to the App Store, if the user has an active Play Store subscription it will point there. If there are no active subscriptions it will be null. If there are multiple for different platforms, it will point to the device store. |


#### PurchasesEntitlementInfos

Contains all the entitlements associated to the user.

| Prop         | Type                                                                                              | Description                                                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`all`**    | <code>{ [key: string]: <a href="#purchasesentitlementinfo">PurchasesEntitlementInfo</a>; }</code> | Map of all EntitlementInfo (<a href="#purchasesentitlementinfo">`PurchasesEntitlementInfo`</a>) objects (active and inactive) keyed by entitlement identifier. |
| **`active`** | <code>{ [key: string]: <a href="#purchasesentitlementinfo">PurchasesEntitlementInfo</a>; }</code> | Map of active EntitlementInfo (<a href="#purchasesentitlementinfo">`PurchasesEntitlementInfo`</a>) objects keyed by entitlement identifier.                    |


#### PurchasesEntitlementInfo

The EntitlementInfo object gives you access to all of the information about the status of a user entitlement.

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


#### PurchasesTransaction

| Prop               | Type                | Description                                          |
| ------------------ | ------------------- | ---------------------------------------------------- |
| **`revenueCatId`** | <code>string</code> | RevenueCat Id associated to the transaction.         |
| **`productId`**    | <code>string</code> | Product Id associated with the transaction.          |
| **`purchaseDate`** | <code>string</code> | Purchase date of the transaction in ISO 8601 format. |


#### PurchasesOfferings

Contains all the offerings configured in RevenueCat dashboard.
For more info see https://docs.revenuecat.com/docs/entitlements

| Prop          | Type                                                                                | Description                                                                 |
| ------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **`all`**     | <code>{ [key: string]: <a href="#purchasesoffering">PurchasesOffering</a>; }</code> | Map of all Offerings [PurchasesOffering] objects keyed by their identifier. |
| **`current`** | <code><a href="#purchasesoffering">PurchasesOffering</a> \| null</code>             | Current offering configured in the RevenueCat dashboard.                    |


#### PurchasesOffering

An offering is a collection of Packages (<a href="#purchasespackage">`PurchasesPackage`</a>) available for the user to purchase.
For more info see https://docs.revenuecat.com/docs/entitlements

| Prop                    | Type                                                                  | Description                                                                    |
| ----------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **`identifier`**        | <code>string</code>                                                   | Unique identifier defined in RevenueCat dashboard.                             |
| **`serverDescription`** | <code>string</code>                                                   | Offering description defined in RevenueCat dashboard.                          |
| **`availablePackages`** | <code>PurchasesPackage[]</code>                                       | Array of `Package` objects available for purchase.                             |
| **`lifetime`**          | <code><a href="#purchasespackage">PurchasesPackage</a> \| null</code> | Lifetime package type configured in the RevenueCat dashboard, if available.    |
| **`annual`**            | <code><a href="#purchasespackage">PurchasesPackage</a> \| null</code> | Annual package type configured in the RevenueCat dashboard, if available.      |
| **`sixMonth`**          | <code><a href="#purchasespackage">PurchasesPackage</a> \| null</code> | Six month package type configured in the RevenueCat dashboard, if available.   |
| **`threeMonth`**        | <code><a href="#purchasespackage">PurchasesPackage</a> \| null</code> | Three month package type configured in the RevenueCat dashboard, if available. |
| **`twoMonth`**          | <code><a href="#purchasespackage">PurchasesPackage</a> \| null</code> | Two month package type configured in the RevenueCat dashboard, if available.   |
| **`monthly`**           | <code><a href="#purchasespackage">PurchasesPackage</a> \| null</code> | Monthly package type configured in the RevenueCat dashboard, if available.     |
| **`weekly`**            | <code><a href="#purchasespackage">PurchasesPackage</a> \| null</code> | Weekly package type configured in the RevenueCat dashboard, if available.      |


#### UpgradeInfo

Holds the information used when upgrading from another sku. For Android use only.

| Prop                | Type                                                      | Description                                                  |
| ------------------- | --------------------------------------------------------- | ------------------------------------------------------------ |
| **`oldSKU`**        | <code>string</code>                                       | The oldSKU to upgrade from.                                  |
| **`prorationMode`** | <code><a href="#proration_mode">PRORATION_MODE</a></code> | The [PRORATION_MODE] to use when upgrading the given oldSKU. |


#### LogInResult

Holds the logIn result

| Prop                | Type                                                    | Description                                                                        |
| ------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **`purchaserInfo`** | <code><a href="#purchaserinfo">PurchaserInfo</a></code> | The Purchaser Info for the user.                                                   |
| **`created`**       | <code>boolean</code>                                    | True if the call resulted in a new user getting created in the RevenueCat backend. |


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


#### PRORATION_MODE

| Members                                             | Value          | Description                                                                                                                                                                               |
| --------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`UNKNOWN_SUBSCRIPTION_UPGRADE_DOWNGRADE_POLICY`** | <code>0</code> |                                                                                                                                                                                           |
| **`IMMEDIATE_WITH_TIME_PRORATION`**                 | <code>1</code> | Replacement takes effect immediately, and the remaining time will be prorated and credited to the user. This is the current default behavior.                                             |
| **`IMMEDIATE_AND_CHARGE_PRORATED_PRICE`**           | <code>2</code> | Replacement takes effect immediately, and the billing cycle remains the same. The price for the remaining period will be charged. This option is only available for subscription upgrade. |
| **`IMMEDIATE_WITHOUT_PRORATION`**                   | <code>3</code> | Replacement takes effect immediately, and the new price will be charged on next recurrence time. The billing cycle stays the same.                                                        |
| **`DEFERRED`**                                      | <code>4</code> | Replacement takes effect when the old plan expires, and the new price will be charged at the same time.                                                                                   |

</docgen-api>

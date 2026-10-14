## v14 API Changes

This release updates the Android SDK dependency from v10 to v11, which uses Google Play Billing Library 9.1.0 and Kotlin 2.2. The iOS SDK dependency does not change major version.

### Migration Guides

- See [Android Native - V11 API Migration Guide](https://github.com/RevenueCat/purchases-android/blob/main/migrations/v11-MIGRATION.md) for a more thorough explanation of the Android changes.

### New Minimum Versions

- Android: `compileSdkVersion` 35 and Kotlin 2.1.0. Capacitor 8 projects already meet both.

Capacitor version and iOS and Android minimum OS versions do not change.

### Methods without a return value now wait for the native SDK

Methods that return `Promise<void>`, such as `configure`, `setLogLevel`, the `set*` attribute setters and `invalidateCustomerInfoCache`, used to resolve immediately, before the native SDK had run, and native errors were dropped. They now resolve once the native call has finished and reject if it fails.

Awaited calls now take as long as the native work. Errors that were previously lost now reject the promise, and surface as unhandled rejections where the promise is not awaited or caught. Handle them:

```typescript
try {
  await Purchases.setAttributes(attributes);
} catch (error) {
  // previously never reached
}
```

### `syncAmazonPurchase` requires `purchaseTime`

`SyncAmazonPurchaseOptions.purchaseTime` is now required. Pass the purchase time in milliseconds since epoch from the Amazon receipt.

```typescript
await Purchases.syncAmazonPurchase({
  productID,
  receiptID,
  amazonUserID,
  isoCurrencyCode,
  price,
  purchaseTime: receipt.purchaseTime, // now required
});
```

The deprecated `syncObserverModeAmazonPurchase` takes `SyncObserverModeAmazonPurchaseOptions`, which no longer aliases `SyncAmazonPurchaseOptions` and has no `purchaseTime`.

### `PurchasesEntitlementInfo.periodType` is typed as `PeriodType`

`periodType` was typed as `string`. It is now the `PeriodType` union: `"NORMAL" | "INTRO" | "TRIAL" | "PREPAID"`. Values at runtime do not change. Comparisons against any other string, such as lowercase `"trial"`, no longer compile. They never matched, so once you fix the comparison, the code behind it runs for the first time. Check it before shipping.

### Jetpack Compose and `material-icons-core` on Android

If your app has native Android code that uses Jetpack Compose, `@revenuecat/purchases-capacitor-ui` raises your Compose libraries to BOM 2026.06.01. Those versions no longer bring in `material-icons-core`, so declare it if your native code uses `Icons`. See the [Android guide](https://github.com/RevenueCat/purchases-android/blob/main/migrations/v11-MIGRATION.md#jetpack-compose-revenuecatui).

### Blocked Play Store reports `PURCHASE_NOT_ALLOWED_ERROR`

When the Play Store is blocked on the device (for example in OEM kids modes), purchases now fail with `PURCHASES_ERROR_CODE.PURCHASE_NOT_ALLOWED_ERROR` instead of `PURCHASES_ERROR_CODE.STORE_PROBLEM_ERROR`. `STORE_PROBLEM_ERROR` is still reported for other store failures, so handle the new code alongside it rather than replacing it.

### Other Play Billing libraries in your app

The Android SDK puts Play Billing Library 9.1.0 on your app's classpath. Any other in-app purchase plugin in the same app, for example one you use to complete purchases with your own code, must support Play Billing Library 9. Versions that use APIs it removed, such as `SkuDetails`, fail at build time or at runtime.

### Reporting undocumented issues:

Feel free to file an issue! [New RevenueCat Issue](https://github.com/RevenueCat/purchases-capacitor/issues/new/).

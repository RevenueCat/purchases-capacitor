## RevenueCat SDK
### CocoaPods
Because of the CocoaPods trunk freeze (November 1 to 7), the `PurchasesHybridCommon` 20.0.0 pod this release depends on is not published yet; it will be after November 7. Until then, iOS projects that install through CocoaPods can't resolve this version. Use Swift Package Manager, or stay on 13.x until the pod is available.

CocoaPods trunk becomes permanently read-only on December 2, 2026, so a later major release will drop CocoaPods support. We recommend moving to Swift Package Manager.

### 💥 Breaking Changes
This release updates the Android SDK to v11, which uses Google Play Billing Library 9.1.0 and requires Kotlin 2.1.0 and compileSdk 35. Capacitor, iOS and Android minimum OS versions do not change.

`SyncAmazonPurchaseOptions.purchaseTime` is now required. `syncObserverModeAmazonPurchase` keeps its own options type without it.

`PurchasesEntitlementInfo.periodType` is typed as `PeriodType` instead of `string`; runtime values do not change.

Methods returning `Promise<void>` (`configure`, `setLogLevel`, the attribute setters, `invalidateCustomerInfoCache` and others) now resolve after the native call completes and reject on native errors. Previously they resolved immediately and dropped errors.

On iOS, paywalls no longer call `onPurchaseCompleted` for purchases without a store transaction, matching Android. Offerings errors during a package purchase are reported as the real error instead of `PRODUCT_NOT_AVAILABLE_FOR_PURCHASE`.

On Android, a blocked Play Store now reports `PURCHASE_NOT_ALLOWED_ERROR` instead of `STORE_PROBLEM_ERROR`, and apps with native Compose code are raised to Compose BOM 2026.06.01.

See the [v14 migration guide](https://github.com/RevenueCat/purchases-capacitor/blob/main/migrations/v14-MIGRATION.md).

* Make purchaseTime required in syncAmazonPurchase (#935) via Toni Rico (@tonidero)

### 🐞 Bugfixes
* [SDK-4410] Fix ReturnNone methods resolving early and swallowing native errors (#934) via Toni Rico (@tonidero)

### 🔄 Other Changes
* ci: separate SPM and CocoaPods release checks (#988) via Antonio Pallares (@ajpallares)
* docs: cover the iOS offerings error change in the v14 migration guide (#984) via Álvaro Brey (@AlvaroBrey)
* Build against purchases-hybrid-common 20.0.0-SNAPSHOT (#972) via Álvaro Brey (@AlvaroBrey)
* Add the v14 migration guide (#964) via Álvaro Brey (@AlvaroBrey)
* Use PHC 20.0-dev TypeScript types via a temporary tarball (#932) via Álvaro Brey (@AlvaroBrey)

## RevenueCatUI SDK
### 🔄 Other Changes
* Make the iOS purchase completed transaction non-optional (#966) via Álvaro Brey (@AlvaroBrey)

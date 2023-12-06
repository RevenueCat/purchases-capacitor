## 7.3.0
### Dependency Updates
* [AUTOMATIC BUMP] Updates purchases-hybrid-common to 8.1.0 (#161) via RevenueCat Git Bot (@RCGitBot)
  * [Android 7.2.6](https://github.com/RevenueCat/purchases-android/releases/tag/7.2.6)
  * [Android 7.2.5](https://github.com/RevenueCat/purchases-android/releases/tag/7.2.5)
  * [iOS 4.31.1](https://github.com/RevenueCat/purchases-ios/releases/tag/4.31.1)
  * [iOS 4.31.0](https://github.com/RevenueCat/purchases-ios/releases/tag/4.31.0)

## 7.2.0
### New Features
* Trusted entitlements: Add trusted entitlements support (#157) via Toni Rico (@tonidero)
### Dependency Updates
* [AUTOMATIC BUMP] Updates purchases-hybrid-common to 8.0.0 (#156) via RevenueCat Git Bot (@RCGitBot)
  * [Android 7.2.4](https://github.com/RevenueCat/purchases-android/releases/tag/7.2.4)
* [AUTOMATIC BUMP] Updates purchases-hybrid-common to 7.4.0 (#155) via RevenueCat Git Bot (@RCGitBot)
  * [Android 7.2.4](https://github.com/RevenueCat/purchases-android/releases/tag/7.2.4)
### Other Changes
* `CI`: disable `prepare-next-version` (#153) via NachoSoto (@NachoSoto)

## 7.1.1
### Dependency Updates
* [AUTOMATIC BUMP] Updates purchases-hybrid-common to 7.3.3 (#150) via RevenueCat Git Bot (@RCGitBot)
  * [Android 7.2.3](https://github.com/RevenueCat/purchases-android/releases/tag/7.2.3)
  * [Android 7.2.2](https://github.com/RevenueCat/purchases-android/releases/tag/7.2.2)
  * [Android 7.2.1](https://github.com/RevenueCat/purchases-android/releases/tag/7.2.1)
  * [iOS 4.30.5](https://github.com/RevenueCat/purchases-ios/releases/tag/4.30.5)
  * [iOS 4.30.4](https://github.com/RevenueCat/purchases-ios/releases/tag/4.30.4)
  * [iOS 4.30.3](https://github.com/RevenueCat/purchases-ios/releases/tag/4.30.3)
* [AUTOMATIC BUMP] Updates purchases-hybrid-common to 7.3.2 (#149) via RevenueCat Git Bot (@RCGitBot)
* [AUTOMATIC BUMP] Updates purchases-hybrid-common to 7.3.1 (#144) via RevenueCat Git Bot (@RCGitBot)

## 7.1.0
### Other Changes
* Fix missing gitignore causing release process errors via Toni Rico (@tonidero)
### Dependency Updates
* [AUTOMATIC BUMP] Updates purchases-hybrid-common to 7.3.0 (#142) via RevenueCat Git Bot (@RCGitBot)
   * [Android 7.2.0](https://github.com/RevenueCat/purchases-android/releases/tag/7.2.0)
   * [iOS 4.30.2](https://github.com/RevenueCat/purchases-ios/releases/tag/4.30.2)

## 7.0.0
**RevenueCat Capacitor SDK v7** is here!! 😻

This latest release updates the SDK to use BillingClient 6 in Android. This version of BillingClient brings little change compared with BillingClient 5 which brought an entire new subscription model which resulted in large changes across the entire SDK.

The only modification at the API level involves replacing "ProrationMode" with "ReplacementMode". The specific replacement modes remain unchanged.

If your app doesn't currently use DEFERRED replacement modes, then you should be safe to upgrade to this version without changes in behavior.

If your app supports product changes using [DEFERRED replacement mode](https://www.revenuecat.com/docs/managing-subscriptions#google-play), then you can either stick with the previous major version until support for DEFERRED is re-introduced in this major version, or you can remove DEFERRED replacement options from your app.

If you are using the SDK in observer mode, you should only use v7 in Android if you're using BillingClient 6.

See the [Android Native - 6.x to 7.x Migration](https://github.com/RevenueCat/purchases-android/blob/main/migrations/v7-MIGRATION.md) for more details.

If you come from an older version of the RevenueCat SDK, see [Android Native - 5.x to 6.x Migration](https://www.revenuecat.com/docs/android-native-5x-to-6x-migration) for a more thorough explanation of the new Google subscription model announced with BillingClient 5 and how to take advantage of it.

### Bumped minimum Android SDK version

RevenueCat SDK v7 bumps minimum Android SDK version from Android 4.0 (API level 16) to Android 4.4 (API level 19).

### Support for InApp Messages

We've added new APIs to support InApp messages both in Android and iOS. You can read more about:
* [Google Play InApp Messages](https://rev.cat/googleplayinappmessaging) which will show users a snackbar message during grace period and account hold once per day and provide them an opportunity to fix their payment without leaving the app. 
* [App Store InApp messages](https://rev.cat/storekit-message) which will show a modal during grace period once per subscription.

InApp Messages are shown by default in both platforms. If you want to disable this behaviour during configuration of the RevenueCat SDK, setup the `shouldShowInAppMessagesAutomatically` property during configuration to `false`:

```typescript
  Purchases.configure({
    apiKey,
    appUserID,
    observerMode,
    userDefaultsSuiteName,
    usesStoreKit2IfAvailable,
    useAmazon,
    shouldShowInAppMessagesAutomatically
  });
```

### Dependency Updates
* [AUTOMATIC BUMP] Updates purchases-hybrid-common to 7.0.0 (#130) via RevenueCat Git Bot (@RCGitBot)
  * [Android 7.0.0](https://github.com/RevenueCat/purchases-android/releases/tag/7.0.0)
  * [iOS 4.27.0](https://github.com/RevenueCat/purchases-ios/releases/tag/4.27.0)
  * [iOS 4.26.2](https://github.com/RevenueCat/purchases-ios/releases/tag/4.26.2)

## 6.1.0
### Dependency Updates
* [AUTOMATIC BUMP] Updates purchases-hybrid-common to 6.3.0 (#126) via RevenueCat Git Bot (@RCGitBot)
  * [Android 6.9.5](https://github.com/RevenueCat/purchases-android/releases/tag/6.9.5)
  * [iOS 4.26.1](https://github.com/RevenueCat/purchases-ios/releases/tag/4.26.1)
  * [iOS 4.26.0](https://github.com/RevenueCat/purchases-ios/releases/tag/4.26.0)
### Other Changes
* Update cocoapods to 1.13.0 (#124) via Toni Rico (@tonidero)
* Fix hybrid common upgrades automation (#118) via Toni Rico (@tonidero)
* Fix release job in CircleCI (#111) via Toni Rico (@tonidero)

## 6.0.0

**RevenueCat Capacitor SDK v6** is here!! 😻

## Important Announcement: Official Ownership Transition
We are thrilled to announce that RevenueCat has officially taken over the ownership and development of this plugin from @riderx.
This transition marks the beginning of a new chapter for Capacitor Purchases, as it becomes the official plugin supported by RevenueCat.
As a part of this transition, the plugin's npm package has moved from `@capgo/capacitor-purchases` to [`@revenuecat/purchases-capacitor`](https://www.npmjs.com/package/@revenuecat/purchases-capacitor).

## A Heartfelt Thank You to @riderx and @cap-go
We want to extend our deepest gratitude to @riderx and @cap-go for their incredible work on Capacitor Purchases.
Their dedication and skill have laid a strong foundation for the plugin's future.
We are committed to continuing the legacy of excellence they have established.

## What's New in This Release
With this transition, we are also excited to introduce new features and improvements that enhance the plugin's performance, usability, and functionality:

- This release updates the SDK to use BillingClient 5 in Android. This version of BillingClient brings an entire new subscription model which has resulted in large changes across the entire SDK.
- We are adding new functionality previously not available in this plugin to make it as powerful as our other SDKs. Some of these features include:
  - Use `getProducts` and `purchaseStoreProduct` if you're not using RevenueCat offerings system to still allow purchases
  - Set attributes in our SDK so they are available in RevenueCat and any integrations that you use. For example `setEmail`, `setAppsflyerID`, `setFirebaseAppInstanceID`,...
  - Begin a refund request from the SDK in iOS
  - Promotional purchases in iOS
  - And much more.
- Please see a list of our new APIs in [our v6 migration doc](https://github.com/RevenueCat/purchases-capacitor/blob/release/6.0.0/migrations/v6-MIGRATION.md#new-plugin-methods

## Future Roadmap
As the new stewards of Capacitor Purchases, we have big plans for its continued development and improvement. Stay tuned for regular updates, new features, and top-notch support.

## Migration Guides
- See the full list of API changes in [our v6 migration doc](https://github.com/RevenueCat/purchases-capacitor/blob/release/6.0.0/migrations/v6-MIGRATION.md)

- See [Android Native - 5.x to 6.x Migration](https://www.revenuecat.com/docs/android-native-5x-to-6x-migration) for a
  more thorough explanation of the new Google subscription model announced with BillingClient 5 and how to take
  advantage of it in V6. This guide includes tips on product setup with the new model.


# CapGo's plugin releases (@capgo/capacitor-purchases)

## [5.1.0](https://github.com/RevenueCat/purchases-capacitor/compare/5.0.8...5.1.0) (2023-08-01)


### Features

* add missing getProducts ([9d6871b](https://github.com/RevenueCat/purchases-capacitor/commit/9d6871b1d718702e9894e9c969f51bb0cc591055))

### [5.0.8](https://github.com/RevenueCat/purchases-capacitor/compare/5.0.7...5.0.8) (2023-07-31)


### Bug Fixes

* **deps:** update dependency com.android.tools.build:gradle to v8.1.0 ([6349d54](https://github.com/RevenueCat/purchases-capacitor/commit/6349d54d8445f2779c6be73f87161c2c340ee3ea))

### [5.0.7](https://github.com/RevenueCat/purchases-capacitor/compare/5.0.6...5.0.7) (2023-07-17)

### [5.0.6](https://github.com/RevenueCat/purchases-capacitor/compare/5.0.5...5.0.6) (2023-07-03)

### [5.0.5](https://github.com/RevenueCat/purchases-capacitor/compare/5.0.4...5.0.5) (2023-06-15)

### [5.0.4](https://github.com/RevenueCat/purchases-capacitor/compare/5.0.3...5.0.4) (2023-06-15)


### Bug Fixes

* purchasecustomerInforInfo to customerInfo ([df2b742](https://github.com/RevenueCat/purchases-capacitor/commit/df2b742cdf1b968eb54469a4497486b25ad1a0f7))

### [5.0.3](https://github.com/RevenueCat/purchases-capacitor/compare/5.0.2...5.0.3) (2023-06-12)


### Bug Fixes

* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.18.0 ([02919da](https://github.com/RevenueCat/purchases-capacitor/commit/02919da3bea8fe323af045ee4a4f81d7e2ac4946))

### [5.0.2](https://github.com/RevenueCat/purchases-capacitor/compare/5.0.1...5.0.2) (2023-06-05)


### Bug Fixes

* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.17.0 ([11d2eac](https://github.com/RevenueCat/purchases-capacitor/commit/11d2eacfd9280d3993be106586a4833b0926aaa4))

### [5.0.1](https://github.com/RevenueCat/purchases-capacitor/compare/5.0.0...5.0.1) (2023-06-01)


### Bug Fixes

* Update README.md ([2f0d8ed](https://github.com/RevenueCat/purchases-capacitor/commit/2f0d8eda0e230fdf9b578a478c9607f817e6147c))

## [5.0.0](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.24...5.0.0) (2023-06-01)


### ⚠ BREAKING CHANGES

* capacitor 5 update

### Features

* add collectDeviceIdentifiers and enableAdServicesAttributionTokenCollection ([14e07c0](https://github.com/RevenueCat/purchases-capacitor/commit/14e07c06ea3f70fbaecb8204ddd995cfaca74ff3))
* capacitor 5 update ([33f0f53](https://github.com/RevenueCat/purchases-capacitor/commit/33f0f53f5c72a549158a6c40f6a640e10dfcba93))


### Bug Fixes

* build script ([921f631](https://github.com/RevenueCat/purchases-capacitor/commit/921f63178e694e21e8fc9e4baaec328f0ac55ab2))
* capacitor 5 build ([01afc34](https://github.com/RevenueCat/purchases-capacitor/commit/01afc34e1bbba1991f4bb7c38c93b081ec5ae933))
* **deps:** update dependency com.android.tools.build:gradle to v8.0.1 ([d257919](https://github.com/RevenueCat/purchases-capacitor/commit/d25791993f4f8ef86bcc821ed6f981450bca6379))
* **deps:** update dependency com.android.tools.build:gradle to v8.0.2 ([44ea4cd](https://github.com/RevenueCat/purchases-capacitor/commit/44ea4cd1dceb78893555638aeb33f7120b9f8b2b))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.7.1 ([2f5b3eb](https://github.com/RevenueCat/purchases-capacitor/commit/2f5b3eb3b31433a665e39814da8b5e952b45cceb))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.8.2 ([c67fb7c](https://github.com/RevenueCat/purchases-capacitor/commit/c67fb7c86abeddeaddaa951bdff81dece67c8bbd))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.0 ([33fb5e7](https://github.com/RevenueCat/purchases-capacitor/commit/33fb5e7f3da181ab6d30b739b4c4c49a7ac383e0))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.5 ([92a8cda](https://github.com/RevenueCat/purchases-capacitor/commit/92a8cdac3d35108a5403135923767e1f711080a1))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.0 ([5135101](https://github.com/RevenueCat/purchases-capacitor/commit/5135101a2f0d5de97834f7c3537fe43ba90bb554))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.1 ([55e833b](https://github.com/RevenueCat/purchases-capacitor/commit/55e833b8c5bddedad3bb85de16526c41277ef346))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.2 ([fa47a65](https://github.com/RevenueCat/purchases-capacitor/commit/fa47a65d5078a01f46dfce0b6497ab8ad4438147))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.3 ([f65a3a4](https://github.com/RevenueCat/purchases-capacitor/commit/f65a3a4fe4b200cc7c7097bedab563d4651a94c2))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.15.0 ([24dc0ad](https://github.com/RevenueCat/purchases-capacitor/commit/24dc0ad1fab8a0143c22980046516d9c0198e844))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.16.0 ([46ee161](https://github.com/RevenueCat/purchases-capacitor/commit/46ee1611e08bee33fdb99180dca77587eca983f2))
* isssue docgen ([a8fb90e](https://github.com/RevenueCat/purchases-capacitor/commit/a8fb90e4148c68841b9868463ba9a730ea96dc35))
* readme ([f93260a](https://github.com/RevenueCat/purchases-capacitor/commit/f93260ae44657d320018f884a36fe6d28221880d))
* ts v5 ([80ab44d](https://github.com/RevenueCat/purchases-capacitor/commit/80ab44dba9fda0847d308e1a279040ebe31594b8))
* Update package.json ([ecde0eb](https://github.com/RevenueCat/purchases-capacitor/commit/ecde0ebee49f2c49903441c61086f95ab6c4ca09))

## [6.0.0](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.24...6.0.0) (2023-06-01)


### ⚠ BREAKING CHANGES

* capacitor 5 update

### Features

* add collectDeviceIdentifiers and enableAdServicesAttributionTokenCollection ([14e07c0](https://github.com/RevenueCat/purchases-capacitor/commit/14e07c06ea3f70fbaecb8204ddd995cfaca74ff3))
* capacitor 5 update ([33f0f53](https://github.com/RevenueCat/purchases-capacitor/commit/33f0f53f5c72a549158a6c40f6a640e10dfcba93))


### Bug Fixes

* build script ([921f631](https://github.com/RevenueCat/purchases-capacitor/commit/921f63178e694e21e8fc9e4baaec328f0ac55ab2))
* capacitor 5 build ([01afc34](https://github.com/RevenueCat/purchases-capacitor/commit/01afc34e1bbba1991f4bb7c38c93b081ec5ae933))
* **deps:** update dependency com.android.tools.build:gradle to v8.0.1 ([d257919](https://github.com/RevenueCat/purchases-capacitor/commit/d25791993f4f8ef86bcc821ed6f981450bca6379))
* **deps:** update dependency com.android.tools.build:gradle to v8.0.2 ([44ea4cd](https://github.com/RevenueCat/purchases-capacitor/commit/44ea4cd1dceb78893555638aeb33f7120b9f8b2b))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.7.1 ([2f5b3eb](https://github.com/RevenueCat/purchases-capacitor/commit/2f5b3eb3b31433a665e39814da8b5e952b45cceb))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.8.2 ([c67fb7c](https://github.com/RevenueCat/purchases-capacitor/commit/c67fb7c86abeddeaddaa951bdff81dece67c8bbd))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.0 ([33fb5e7](https://github.com/RevenueCat/purchases-capacitor/commit/33fb5e7f3da181ab6d30b739b4c4c49a7ac383e0))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.5 ([92a8cda](https://github.com/RevenueCat/purchases-capacitor/commit/92a8cdac3d35108a5403135923767e1f711080a1))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.0 ([5135101](https://github.com/RevenueCat/purchases-capacitor/commit/5135101a2f0d5de97834f7c3537fe43ba90bb554))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.1 ([55e833b](https://github.com/RevenueCat/purchases-capacitor/commit/55e833b8c5bddedad3bb85de16526c41277ef346))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.2 ([fa47a65](https://github.com/RevenueCat/purchases-capacitor/commit/fa47a65d5078a01f46dfce0b6497ab8ad4438147))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.3 ([f65a3a4](https://github.com/RevenueCat/purchases-capacitor/commit/f65a3a4fe4b200cc7c7097bedab563d4651a94c2))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.15.0 ([24dc0ad](https://github.com/RevenueCat/purchases-capacitor/commit/24dc0ad1fab8a0143c22980046516d9c0198e844))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.16.0 ([46ee161](https://github.com/RevenueCat/purchases-capacitor/commit/46ee1611e08bee33fdb99180dca77587eca983f2))
* isssue docgen ([a8fb90e](https://github.com/RevenueCat/purchases-capacitor/commit/a8fb90e4148c68841b9868463ba9a730ea96dc35))
* readme ([f93260a](https://github.com/RevenueCat/purchases-capacitor/commit/f93260ae44657d320018f884a36fe6d28221880d))
* ts v5 ([80ab44d](https://github.com/RevenueCat/purchases-capacitor/commit/80ab44dba9fda0847d308e1a279040ebe31594b8))
* Update package.json ([ecde0eb](https://github.com/RevenueCat/purchases-capacitor/commit/ecde0ebee49f2c49903441c61086f95ab6c4ca09))

## [10.0.0](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.24...10.0.0) (2023-06-01)


### ⚠ BREAKING CHANGES

* capacitor 5 update

### Features

* add collectDeviceIdentifiers and enableAdServicesAttributionTokenCollection ([14e07c0](https://github.com/RevenueCat/purchases-capacitor/commit/14e07c06ea3f70fbaecb8204ddd995cfaca74ff3))
* capacitor 5 update ([33f0f53](https://github.com/RevenueCat/purchases-capacitor/commit/33f0f53f5c72a549158a6c40f6a640e10dfcba93))


### Bug Fixes

* build script ([921f631](https://github.com/RevenueCat/purchases-capacitor/commit/921f63178e694e21e8fc9e4baaec328f0ac55ab2))
* capacitor 5 build ([01afc34](https://github.com/RevenueCat/purchases-capacitor/commit/01afc34e1bbba1991f4bb7c38c93b081ec5ae933))
* **deps:** update dependency com.android.tools.build:gradle to v8.0.1 ([d257919](https://github.com/RevenueCat/purchases-capacitor/commit/d25791993f4f8ef86bcc821ed6f981450bca6379))
* **deps:** update dependency com.android.tools.build:gradle to v8.0.2 ([44ea4cd](https://github.com/RevenueCat/purchases-capacitor/commit/44ea4cd1dceb78893555638aeb33f7120b9f8b2b))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.7.1 ([2f5b3eb](https://github.com/RevenueCat/purchases-capacitor/commit/2f5b3eb3b31433a665e39814da8b5e952b45cceb))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.8.2 ([c67fb7c](https://github.com/RevenueCat/purchases-capacitor/commit/c67fb7c86abeddeaddaa951bdff81dece67c8bbd))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.0 ([33fb5e7](https://github.com/RevenueCat/purchases-capacitor/commit/33fb5e7f3da181ab6d30b739b4c4c49a7ac383e0))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.5 ([92a8cda](https://github.com/RevenueCat/purchases-capacitor/commit/92a8cdac3d35108a5403135923767e1f711080a1))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.0 ([5135101](https://github.com/RevenueCat/purchases-capacitor/commit/5135101a2f0d5de97834f7c3537fe43ba90bb554))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.1 ([55e833b](https://github.com/RevenueCat/purchases-capacitor/commit/55e833b8c5bddedad3bb85de16526c41277ef346))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.2 ([fa47a65](https://github.com/RevenueCat/purchases-capacitor/commit/fa47a65d5078a01f46dfce0b6497ab8ad4438147))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.3 ([f65a3a4](https://github.com/RevenueCat/purchases-capacitor/commit/f65a3a4fe4b200cc7c7097bedab563d4651a94c2))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.15.0 ([24dc0ad](https://github.com/RevenueCat/purchases-capacitor/commit/24dc0ad1fab8a0143c22980046516d9c0198e844))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.16.0 ([46ee161](https://github.com/RevenueCat/purchases-capacitor/commit/46ee1611e08bee33fdb99180dca77587eca983f2))
* isssue docgen ([a8fb90e](https://github.com/RevenueCat/purchases-capacitor/commit/a8fb90e4148c68841b9868463ba9a730ea96dc35))
* readme ([f93260a](https://github.com/RevenueCat/purchases-capacitor/commit/f93260ae44657d320018f884a36fe6d28221880d))
* ts v5 ([80ab44d](https://github.com/RevenueCat/purchases-capacitor/commit/80ab44dba9fda0847d308e1a279040ebe31594b8))

## [9.0.0](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.24...9.0.0) (2023-05-29)


### ⚠ BREAKING CHANGES

* capacitor 5 update

### Features

* add collectDeviceIdentifiers and enableAdServicesAttributionTokenCollection ([14e07c0](https://github.com/RevenueCat/purchases-capacitor/commit/14e07c06ea3f70fbaecb8204ddd995cfaca74ff3))
* capacitor 5 update ([33f0f53](https://github.com/RevenueCat/purchases-capacitor/commit/33f0f53f5c72a549158a6c40f6a640e10dfcba93))


### Bug Fixes

* build script ([921f631](https://github.com/RevenueCat/purchases-capacitor/commit/921f63178e694e21e8fc9e4baaec328f0ac55ab2))
* capacitor 5 build ([01afc34](https://github.com/RevenueCat/purchases-capacitor/commit/01afc34e1bbba1991f4bb7c38c93b081ec5ae933))
* **deps:** update dependency com.android.tools.build:gradle to v8.0.1 ([d257919](https://github.com/RevenueCat/purchases-capacitor/commit/d25791993f4f8ef86bcc821ed6f981450bca6379))
* **deps:** update dependency com.android.tools.build:gradle to v8.0.2 ([44ea4cd](https://github.com/RevenueCat/purchases-capacitor/commit/44ea4cd1dceb78893555638aeb33f7120b9f8b2b))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.7.1 ([2f5b3eb](https://github.com/RevenueCat/purchases-capacitor/commit/2f5b3eb3b31433a665e39814da8b5e952b45cceb))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.8.2 ([c67fb7c](https://github.com/RevenueCat/purchases-capacitor/commit/c67fb7c86abeddeaddaa951bdff81dece67c8bbd))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.0 ([33fb5e7](https://github.com/RevenueCat/purchases-capacitor/commit/33fb5e7f3da181ab6d30b739b4c4c49a7ac383e0))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.5 ([92a8cda](https://github.com/RevenueCat/purchases-capacitor/commit/92a8cdac3d35108a5403135923767e1f711080a1))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.0 ([5135101](https://github.com/RevenueCat/purchases-capacitor/commit/5135101a2f0d5de97834f7c3537fe43ba90bb554))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.1 ([55e833b](https://github.com/RevenueCat/purchases-capacitor/commit/55e833b8c5bddedad3bb85de16526c41277ef346))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.2 ([fa47a65](https://github.com/RevenueCat/purchases-capacitor/commit/fa47a65d5078a01f46dfce0b6497ab8ad4438147))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.3 ([f65a3a4](https://github.com/RevenueCat/purchases-capacitor/commit/f65a3a4fe4b200cc7c7097bedab563d4651a94c2))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.15.0 ([24dc0ad](https://github.com/RevenueCat/purchases-capacitor/commit/24dc0ad1fab8a0143c22980046516d9c0198e844))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.16.0 ([46ee161](https://github.com/RevenueCat/purchases-capacitor/commit/46ee1611e08bee33fdb99180dca77587eca983f2))
* isssue docgen ([a8fb90e](https://github.com/RevenueCat/purchases-capacitor/commit/a8fb90e4148c68841b9868463ba9a730ea96dc35))
* readme ([f93260a](https://github.com/RevenueCat/purchases-capacitor/commit/f93260ae44657d320018f884a36fe6d28221880d))
* ts v5 ([80ab44d](https://github.com/RevenueCat/purchases-capacitor/commit/80ab44dba9fda0847d308e1a279040ebe31594b8))

## [8.0.0](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.24...8.0.0) (2023-05-29)


### ⚠ BREAKING CHANGES

* capacitor 5 update

### Features

* add collectDeviceIdentifiers and enableAdServicesAttributionTokenCollection ([14e07c0](https://github.com/RevenueCat/purchases-capacitor/commit/14e07c06ea3f70fbaecb8204ddd995cfaca74ff3))
* capacitor 5 update ([33f0f53](https://github.com/RevenueCat/purchases-capacitor/commit/33f0f53f5c72a549158a6c40f6a640e10dfcba93))


### Bug Fixes

* build script ([921f631](https://github.com/RevenueCat/purchases-capacitor/commit/921f63178e694e21e8fc9e4baaec328f0ac55ab2))
* capacitor 5 build ([01afc34](https://github.com/RevenueCat/purchases-capacitor/commit/01afc34e1bbba1991f4bb7c38c93b081ec5ae933))
* **deps:** update dependency com.android.tools.build:gradle to v8.0.1 ([d257919](https://github.com/RevenueCat/purchases-capacitor/commit/d25791993f4f8ef86bcc821ed6f981450bca6379))
* **deps:** update dependency com.android.tools.build:gradle to v8.0.2 ([44ea4cd](https://github.com/RevenueCat/purchases-capacitor/commit/44ea4cd1dceb78893555638aeb33f7120b9f8b2b))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.7.1 ([2f5b3eb](https://github.com/RevenueCat/purchases-capacitor/commit/2f5b3eb3b31433a665e39814da8b5e952b45cceb))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.8.2 ([c67fb7c](https://github.com/RevenueCat/purchases-capacitor/commit/c67fb7c86abeddeaddaa951bdff81dece67c8bbd))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.0 ([33fb5e7](https://github.com/RevenueCat/purchases-capacitor/commit/33fb5e7f3da181ab6d30b739b4c4c49a7ac383e0))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.5 ([92a8cda](https://github.com/RevenueCat/purchases-capacitor/commit/92a8cdac3d35108a5403135923767e1f711080a1))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.0 ([5135101](https://github.com/RevenueCat/purchases-capacitor/commit/5135101a2f0d5de97834f7c3537fe43ba90bb554))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.1 ([55e833b](https://github.com/RevenueCat/purchases-capacitor/commit/55e833b8c5bddedad3bb85de16526c41277ef346))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.2 ([fa47a65](https://github.com/RevenueCat/purchases-capacitor/commit/fa47a65d5078a01f46dfce0b6497ab8ad4438147))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.3 ([f65a3a4](https://github.com/RevenueCat/purchases-capacitor/commit/f65a3a4fe4b200cc7c7097bedab563d4651a94c2))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.15.0 ([24dc0ad](https://github.com/RevenueCat/purchases-capacitor/commit/24dc0ad1fab8a0143c22980046516d9c0198e844))
* isssue docgen ([a8fb90e](https://github.com/RevenueCat/purchases-capacitor/commit/a8fb90e4148c68841b9868463ba9a730ea96dc35))
* readme ([f93260a](https://github.com/RevenueCat/purchases-capacitor/commit/f93260ae44657d320018f884a36fe6d28221880d))
* ts v5 ([80ab44d](https://github.com/RevenueCat/purchases-capacitor/commit/80ab44dba9fda0847d308e1a279040ebe31594b8))

## [7.0.0](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.24...7.0.0) (2023-05-23)


### ⚠ BREAKING CHANGES

* capacitor 5 update

### Features

* add collectDeviceIdentifiers and enableAdServicesAttributionTokenCollection ([14e07c0](https://github.com/RevenueCat/purchases-capacitor/commit/14e07c06ea3f70fbaecb8204ddd995cfaca74ff3))
* capacitor 5 update ([33f0f53](https://github.com/RevenueCat/purchases-capacitor/commit/33f0f53f5c72a549158a6c40f6a640e10dfcba93))


### Bug Fixes

* build script ([921f631](https://github.com/RevenueCat/purchases-capacitor/commit/921f63178e694e21e8fc9e4baaec328f0ac55ab2))
* capacitor 5 build ([01afc34](https://github.com/RevenueCat/purchases-capacitor/commit/01afc34e1bbba1991f4bb7c38c93b081ec5ae933))
* **deps:** update dependency com.android.tools.build:gradle to v8.0.1 ([d257919](https://github.com/RevenueCat/purchases-capacitor/commit/d25791993f4f8ef86bcc821ed6f981450bca6379))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.7.1 ([2f5b3eb](https://github.com/RevenueCat/purchases-capacitor/commit/2f5b3eb3b31433a665e39814da8b5e952b45cceb))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.8.2 ([c67fb7c](https://github.com/RevenueCat/purchases-capacitor/commit/c67fb7c86abeddeaddaa951bdff81dece67c8bbd))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.0 ([33fb5e7](https://github.com/RevenueCat/purchases-capacitor/commit/33fb5e7f3da181ab6d30b739b4c4c49a7ac383e0))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.5 ([92a8cda](https://github.com/RevenueCat/purchases-capacitor/commit/92a8cdac3d35108a5403135923767e1f711080a1))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.0 ([5135101](https://github.com/RevenueCat/purchases-capacitor/commit/5135101a2f0d5de97834f7c3537fe43ba90bb554))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.1 ([55e833b](https://github.com/RevenueCat/purchases-capacitor/commit/55e833b8c5bddedad3bb85de16526c41277ef346))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.2 ([fa47a65](https://github.com/RevenueCat/purchases-capacitor/commit/fa47a65d5078a01f46dfce0b6497ab8ad4438147))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.3 ([f65a3a4](https://github.com/RevenueCat/purchases-capacitor/commit/f65a3a4fe4b200cc7c7097bedab563d4651a94c2))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.15.0 ([24dc0ad](https://github.com/RevenueCat/purchases-capacitor/commit/24dc0ad1fab8a0143c22980046516d9c0198e844))
* isssue docgen ([a8fb90e](https://github.com/RevenueCat/purchases-capacitor/commit/a8fb90e4148c68841b9868463ba9a730ea96dc35))
* readme ([f93260a](https://github.com/RevenueCat/purchases-capacitor/commit/f93260ae44657d320018f884a36fe6d28221880d))
* ts v5 ([80ab44d](https://github.com/RevenueCat/purchases-capacitor/commit/80ab44dba9fda0847d308e1a279040ebe31594b8))

## [6.0.0](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.24...6.0.0) (2023-05-23)


### ⚠ BREAKING CHANGES

* capacitor 5 update

### Features

* add collectDeviceIdentifiers and enableAdServicesAttributionTokenCollection ([14e07c0](https://github.com/RevenueCat/purchases-capacitor/commit/14e07c06ea3f70fbaecb8204ddd995cfaca74ff3))
* capacitor 5 update ([33f0f53](https://github.com/RevenueCat/purchases-capacitor/commit/33f0f53f5c72a549158a6c40f6a640e10dfcba93))


### Bug Fixes

* build script ([921f631](https://github.com/RevenueCat/purchases-capacitor/commit/921f63178e694e21e8fc9e4baaec328f0ac55ab2))
* capacitor 5 build ([01afc34](https://github.com/RevenueCat/purchases-capacitor/commit/01afc34e1bbba1991f4bb7c38c93b081ec5ae933))
* **deps:** update dependency com.android.tools.build:gradle to v8.0.1 ([d257919](https://github.com/RevenueCat/purchases-capacitor/commit/d25791993f4f8ef86bcc821ed6f981450bca6379))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.7.1 ([2f5b3eb](https://github.com/RevenueCat/purchases-capacitor/commit/2f5b3eb3b31433a665e39814da8b5e952b45cceb))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.8.2 ([c67fb7c](https://github.com/RevenueCat/purchases-capacitor/commit/c67fb7c86abeddeaddaa951bdff81dece67c8bbd))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.0 ([33fb5e7](https://github.com/RevenueCat/purchases-capacitor/commit/33fb5e7f3da181ab6d30b739b4c4c49a7ac383e0))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.5 ([92a8cda](https://github.com/RevenueCat/purchases-capacitor/commit/92a8cdac3d35108a5403135923767e1f711080a1))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.0 ([5135101](https://github.com/RevenueCat/purchases-capacitor/commit/5135101a2f0d5de97834f7c3537fe43ba90bb554))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.1 ([55e833b](https://github.com/RevenueCat/purchases-capacitor/commit/55e833b8c5bddedad3bb85de16526c41277ef346))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.2 ([fa47a65](https://github.com/RevenueCat/purchases-capacitor/commit/fa47a65d5078a01f46dfce0b6497ab8ad4438147))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.3 ([f65a3a4](https://github.com/RevenueCat/purchases-capacitor/commit/f65a3a4fe4b200cc7c7097bedab563d4651a94c2))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.15.0 ([24dc0ad](https://github.com/RevenueCat/purchases-capacitor/commit/24dc0ad1fab8a0143c22980046516d9c0198e844))
* isssue docgen ([a8fb90e](https://github.com/RevenueCat/purchases-capacitor/commit/a8fb90e4148c68841b9868463ba9a730ea96dc35))
* readme ([f93260a](https://github.com/RevenueCat/purchases-capacitor/commit/f93260ae44657d320018f884a36fe6d28221880d))
* ts v5 ([80ab44d](https://github.com/RevenueCat/purchases-capacitor/commit/80ab44dba9fda0847d308e1a279040ebe31594b8))

## [5.0.0](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.24...5.0.0) (2023-05-23)


### ⚠ BREAKING CHANGES

* capacitor 5 update

### Features

* add collectDeviceIdentifiers and enableAdServicesAttributionTokenCollection ([14e07c0](https://github.com/RevenueCat/purchases-capacitor/commit/14e07c06ea3f70fbaecb8204ddd995cfaca74ff3))
* capacitor 5 update ([33f0f53](https://github.com/RevenueCat/purchases-capacitor/commit/33f0f53f5c72a549158a6c40f6a640e10dfcba93))


### Bug Fixes

* build script ([921f631](https://github.com/RevenueCat/purchases-capacitor/commit/921f63178e694e21e8fc9e4baaec328f0ac55ab2))
* **deps:** update dependency com.android.tools.build:gradle to v8.0.1 ([d257919](https://github.com/RevenueCat/purchases-capacitor/commit/d25791993f4f8ef86bcc821ed6f981450bca6379))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.7.1 ([2f5b3eb](https://github.com/RevenueCat/purchases-capacitor/commit/2f5b3eb3b31433a665e39814da8b5e952b45cceb))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.8.2 ([c67fb7c](https://github.com/RevenueCat/purchases-capacitor/commit/c67fb7c86abeddeaddaa951bdff81dece67c8bbd))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.0 ([33fb5e7](https://github.com/RevenueCat/purchases-capacitor/commit/33fb5e7f3da181ab6d30b739b4c4c49a7ac383e0))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.5 ([92a8cda](https://github.com/RevenueCat/purchases-capacitor/commit/92a8cdac3d35108a5403135923767e1f711080a1))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.0 ([5135101](https://github.com/RevenueCat/purchases-capacitor/commit/5135101a2f0d5de97834f7c3537fe43ba90bb554))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.1 ([55e833b](https://github.com/RevenueCat/purchases-capacitor/commit/55e833b8c5bddedad3bb85de16526c41277ef346))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.2 ([fa47a65](https://github.com/RevenueCat/purchases-capacitor/commit/fa47a65d5078a01f46dfce0b6497ab8ad4438147))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.3 ([f65a3a4](https://github.com/RevenueCat/purchases-capacitor/commit/f65a3a4fe4b200cc7c7097bedab563d4651a94c2))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.15.0 ([24dc0ad](https://github.com/RevenueCat/purchases-capacitor/commit/24dc0ad1fab8a0143c22980046516d9c0198e844))
* isssue docgen ([a8fb90e](https://github.com/RevenueCat/purchases-capacitor/commit/a8fb90e4148c68841b9868463ba9a730ea96dc35))
* readme ([f93260a](https://github.com/RevenueCat/purchases-capacitor/commit/f93260ae44657d320018f884a36fe6d28221880d))
* ts v5 ([80ab44d](https://github.com/RevenueCat/purchases-capacitor/commit/80ab44dba9fda0847d308e1a279040ebe31594b8))

## [4.0.0](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.24...4.0.0) (2023-05-22)


### ⚠ BREAKING CHANGES

* capacitor 5 update

### Features

* add collectDeviceIdentifiers and enableAdServicesAttributionTokenCollection ([14e07c0](https://github.com/RevenueCat/purchases-capacitor/commit/14e07c06ea3f70fbaecb8204ddd995cfaca74ff3))
* capacitor 5 update ([33f0f53](https://github.com/RevenueCat/purchases-capacitor/commit/33f0f53f5c72a549158a6c40f6a640e10dfcba93))


### Bug Fixes

* build script ([921f631](https://github.com/RevenueCat/purchases-capacitor/commit/921f63178e694e21e8fc9e4baaec328f0ac55ab2))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.7.1 ([2f5b3eb](https://github.com/RevenueCat/purchases-capacitor/commit/2f5b3eb3b31433a665e39814da8b5e952b45cceb))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.8.2 ([c67fb7c](https://github.com/RevenueCat/purchases-capacitor/commit/c67fb7c86abeddeaddaa951bdff81dece67c8bbd))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.0 ([33fb5e7](https://github.com/RevenueCat/purchases-capacitor/commit/33fb5e7f3da181ab6d30b739b4c4c49a7ac383e0))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.5 ([92a8cda](https://github.com/RevenueCat/purchases-capacitor/commit/92a8cdac3d35108a5403135923767e1f711080a1))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.0 ([5135101](https://github.com/RevenueCat/purchases-capacitor/commit/5135101a2f0d5de97834f7c3537fe43ba90bb554))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.1 ([55e833b](https://github.com/RevenueCat/purchases-capacitor/commit/55e833b8c5bddedad3bb85de16526c41277ef346))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.2 ([fa47a65](https://github.com/RevenueCat/purchases-capacitor/commit/fa47a65d5078a01f46dfce0b6497ab8ad4438147))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.3 ([f65a3a4](https://github.com/RevenueCat/purchases-capacitor/commit/f65a3a4fe4b200cc7c7097bedab563d4651a94c2))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.15.0 ([24dc0ad](https://github.com/RevenueCat/purchases-capacitor/commit/24dc0ad1fab8a0143c22980046516d9c0198e844))
* isssue docgen ([a8fb90e](https://github.com/RevenueCat/purchases-capacitor/commit/a8fb90e4148c68841b9868463ba9a730ea96dc35))
* readme ([f93260a](https://github.com/RevenueCat/purchases-capacitor/commit/f93260ae44657d320018f884a36fe6d28221880d))
* ts v5 ([80ab44d](https://github.com/RevenueCat/purchases-capacitor/commit/80ab44dba9fda0847d308e1a279040ebe31594b8))

## [3.0.0](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.24...3.0.0) (2023-05-22)


### ⚠ BREAKING CHANGES

* capacitor 5 update

### Features

* add collectDeviceIdentifiers and enableAdServicesAttributionTokenCollection ([14e07c0](https://github.com/RevenueCat/purchases-capacitor/commit/14e07c06ea3f70fbaecb8204ddd995cfaca74ff3))
* capacitor 5 update ([33f0f53](https://github.com/RevenueCat/purchases-capacitor/commit/33f0f53f5c72a549158a6c40f6a640e10dfcba93))


### Bug Fixes

* build script ([921f631](https://github.com/RevenueCat/purchases-capacitor/commit/921f63178e694e21e8fc9e4baaec328f0ac55ab2))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.7.1 ([2f5b3eb](https://github.com/RevenueCat/purchases-capacitor/commit/2f5b3eb3b31433a665e39814da8b5e952b45cceb))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.8.2 ([c67fb7c](https://github.com/RevenueCat/purchases-capacitor/commit/c67fb7c86abeddeaddaa951bdff81dece67c8bbd))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.0 ([33fb5e7](https://github.com/RevenueCat/purchases-capacitor/commit/33fb5e7f3da181ab6d30b739b4c4c49a7ac383e0))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.5 ([92a8cda](https://github.com/RevenueCat/purchases-capacitor/commit/92a8cdac3d35108a5403135923767e1f711080a1))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.0 ([5135101](https://github.com/RevenueCat/purchases-capacitor/commit/5135101a2f0d5de97834f7c3537fe43ba90bb554))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.1 ([55e833b](https://github.com/RevenueCat/purchases-capacitor/commit/55e833b8c5bddedad3bb85de16526c41277ef346))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.2 ([fa47a65](https://github.com/RevenueCat/purchases-capacitor/commit/fa47a65d5078a01f46dfce0b6497ab8ad4438147))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.3 ([f65a3a4](https://github.com/RevenueCat/purchases-capacitor/commit/f65a3a4fe4b200cc7c7097bedab563d4651a94c2))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.15.0 ([24dc0ad](https://github.com/RevenueCat/purchases-capacitor/commit/24dc0ad1fab8a0143c22980046516d9c0198e844))
* isssue docgen ([a8fb90e](https://github.com/RevenueCat/purchases-capacitor/commit/a8fb90e4148c68841b9868463ba9a730ea96dc35))
* readme ([f93260a](https://github.com/RevenueCat/purchases-capacitor/commit/f93260ae44657d320018f884a36fe6d28221880d))

## [2.9.0](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.24...2.9.0) (2023-05-22)


### Features

* add collectDeviceIdentifiers and enableAdServicesAttributionTokenCollection ([14e07c0](https://github.com/RevenueCat/purchases-capacitor/commit/14e07c06ea3f70fbaecb8204ddd995cfaca74ff3))


### Bug Fixes

* build script ([921f631](https://github.com/RevenueCat/purchases-capacitor/commit/921f63178e694e21e8fc9e4baaec328f0ac55ab2))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.7.1 ([2f5b3eb](https://github.com/RevenueCat/purchases-capacitor/commit/2f5b3eb3b31433a665e39814da8b5e952b45cceb))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.8.2 ([c67fb7c](https://github.com/RevenueCat/purchases-capacitor/commit/c67fb7c86abeddeaddaa951bdff81dece67c8bbd))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.0 ([33fb5e7](https://github.com/RevenueCat/purchases-capacitor/commit/33fb5e7f3da181ab6d30b739b4c4c49a7ac383e0))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.5 ([92a8cda](https://github.com/RevenueCat/purchases-capacitor/commit/92a8cdac3d35108a5403135923767e1f711080a1))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.0 ([5135101](https://github.com/RevenueCat/purchases-capacitor/commit/5135101a2f0d5de97834f7c3537fe43ba90bb554))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.1 ([55e833b](https://github.com/RevenueCat/purchases-capacitor/commit/55e833b8c5bddedad3bb85de16526c41277ef346))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.2 ([fa47a65](https://github.com/RevenueCat/purchases-capacitor/commit/fa47a65d5078a01f46dfce0b6497ab8ad4438147))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.3 ([f65a3a4](https://github.com/RevenueCat/purchases-capacitor/commit/f65a3a4fe4b200cc7c7097bedab563d4651a94c2))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.15.0 ([24dc0ad](https://github.com/RevenueCat/purchases-capacitor/commit/24dc0ad1fab8a0143c22980046516d9c0198e844))
* isssue docgen ([a8fb90e](https://github.com/RevenueCat/purchases-capacitor/commit/a8fb90e4148c68841b9868463ba9a730ea96dc35))

## [2.8.0](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.24...2.8.0) (2023-05-15)


### Features

* add collectDeviceIdentifiers and enableAdServicesAttributionTokenCollection ([14e07c0](https://github.com/RevenueCat/purchases-capacitor/commit/14e07c06ea3f70fbaecb8204ddd995cfaca74ff3))


### Bug Fixes

* build script ([921f631](https://github.com/RevenueCat/purchases-capacitor/commit/921f63178e694e21e8fc9e4baaec328f0ac55ab2))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.7.1 ([2f5b3eb](https://github.com/RevenueCat/purchases-capacitor/commit/2f5b3eb3b31433a665e39814da8b5e952b45cceb))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.8.2 ([c67fb7c](https://github.com/RevenueCat/purchases-capacitor/commit/c67fb7c86abeddeaddaa951bdff81dece67c8bbd))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.0 ([33fb5e7](https://github.com/RevenueCat/purchases-capacitor/commit/33fb5e7f3da181ab6d30b739b4c4c49a7ac383e0))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.5 ([92a8cda](https://github.com/RevenueCat/purchases-capacitor/commit/92a8cdac3d35108a5403135923767e1f711080a1))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.0 ([5135101](https://github.com/RevenueCat/purchases-capacitor/commit/5135101a2f0d5de97834f7c3537fe43ba90bb554))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.1 ([55e833b](https://github.com/RevenueCat/purchases-capacitor/commit/55e833b8c5bddedad3bb85de16526c41277ef346))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.2 ([fa47a65](https://github.com/RevenueCat/purchases-capacitor/commit/fa47a65d5078a01f46dfce0b6497ab8ad4438147))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.3 ([f65a3a4](https://github.com/RevenueCat/purchases-capacitor/commit/f65a3a4fe4b200cc7c7097bedab563d4651a94c2))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.15.0 ([24dc0ad](https://github.com/RevenueCat/purchases-capacitor/commit/24dc0ad1fab8a0143c22980046516d9c0198e844))
* isssue docgen ([a8fb90e](https://github.com/RevenueCat/purchases-capacitor/commit/a8fb90e4148c68841b9868463ba9a730ea96dc35))

## [2.7.0](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.24...2.7.0) (2023-05-08)


### Features

* add collectDeviceIdentifiers and enableAdServicesAttributionTokenCollection ([14e07c0](https://github.com/RevenueCat/purchases-capacitor/commit/14e07c06ea3f70fbaecb8204ddd995cfaca74ff3))


### Bug Fixes

* build script ([921f631](https://github.com/RevenueCat/purchases-capacitor/commit/921f63178e694e21e8fc9e4baaec328f0ac55ab2))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.7.1 ([2f5b3eb](https://github.com/RevenueCat/purchases-capacitor/commit/2f5b3eb3b31433a665e39814da8b5e952b45cceb))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.8.2 ([c67fb7c](https://github.com/RevenueCat/purchases-capacitor/commit/c67fb7c86abeddeaddaa951bdff81dece67c8bbd))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.0 ([33fb5e7](https://github.com/RevenueCat/purchases-capacitor/commit/33fb5e7f3da181ab6d30b739b4c4c49a7ac383e0))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.5 ([92a8cda](https://github.com/RevenueCat/purchases-capacitor/commit/92a8cdac3d35108a5403135923767e1f711080a1))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.0 ([5135101](https://github.com/RevenueCat/purchases-capacitor/commit/5135101a2f0d5de97834f7c3537fe43ba90bb554))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.1 ([55e833b](https://github.com/RevenueCat/purchases-capacitor/commit/55e833b8c5bddedad3bb85de16526c41277ef346))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.2 ([fa47a65](https://github.com/RevenueCat/purchases-capacitor/commit/fa47a65d5078a01f46dfce0b6497ab8ad4438147))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.3 ([f65a3a4](https://github.com/RevenueCat/purchases-capacitor/commit/f65a3a4fe4b200cc7c7097bedab563d4651a94c2))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.15.0 ([24dc0ad](https://github.com/RevenueCat/purchases-capacitor/commit/24dc0ad1fab8a0143c22980046516d9c0198e844))
* isssue docgen ([a8fb90e](https://github.com/RevenueCat/purchases-capacitor/commit/a8fb90e4148c68841b9868463ba9a730ea96dc35))

## [2.6.0](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.24...2.6.0) (2023-05-01)


### Features

* add collectDeviceIdentifiers and enableAdServicesAttributionTokenCollection ([14e07c0](https://github.com/RevenueCat/purchases-capacitor/commit/14e07c06ea3f70fbaecb8204ddd995cfaca74ff3))


### Bug Fixes

* build script ([921f631](https://github.com/RevenueCat/purchases-capacitor/commit/921f63178e694e21e8fc9e4baaec328f0ac55ab2))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.7.1 ([2f5b3eb](https://github.com/RevenueCat/purchases-capacitor/commit/2f5b3eb3b31433a665e39814da8b5e952b45cceb))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.8.2 ([c67fb7c](https://github.com/RevenueCat/purchases-capacitor/commit/c67fb7c86abeddeaddaa951bdff81dece67c8bbd))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.0 ([33fb5e7](https://github.com/RevenueCat/purchases-capacitor/commit/33fb5e7f3da181ab6d30b739b4c4c49a7ac383e0))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.5 ([92a8cda](https://github.com/RevenueCat/purchases-capacitor/commit/92a8cdac3d35108a5403135923767e1f711080a1))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.0 ([5135101](https://github.com/RevenueCat/purchases-capacitor/commit/5135101a2f0d5de97834f7c3537fe43ba90bb554))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.1 ([55e833b](https://github.com/RevenueCat/purchases-capacitor/commit/55e833b8c5bddedad3bb85de16526c41277ef346))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.2 ([fa47a65](https://github.com/RevenueCat/purchases-capacitor/commit/fa47a65d5078a01f46dfce0b6497ab8ad4438147))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.3 ([f65a3a4](https://github.com/RevenueCat/purchases-capacitor/commit/f65a3a4fe4b200cc7c7097bedab563d4651a94c2))
* isssue docgen ([a8fb90e](https://github.com/RevenueCat/purchases-capacitor/commit/a8fb90e4148c68841b9868463ba9a730ea96dc35))

## [2.5.0](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.24...2.5.0) (2023-04-24)


### Features

* add collectDeviceIdentifiers and enableAdServicesAttributionTokenCollection ([14e07c0](https://github.com/RevenueCat/purchases-capacitor/commit/14e07c06ea3f70fbaecb8204ddd995cfaca74ff3))


### Bug Fixes

* build script ([921f631](https://github.com/RevenueCat/purchases-capacitor/commit/921f63178e694e21e8fc9e4baaec328f0ac55ab2))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.7.1 ([2f5b3eb](https://github.com/RevenueCat/purchases-capacitor/commit/2f5b3eb3b31433a665e39814da8b5e952b45cceb))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.8.2 ([c67fb7c](https://github.com/RevenueCat/purchases-capacitor/commit/c67fb7c86abeddeaddaa951bdff81dece67c8bbd))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.0 ([33fb5e7](https://github.com/RevenueCat/purchases-capacitor/commit/33fb5e7f3da181ab6d30b739b4c4c49a7ac383e0))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.5 ([92a8cda](https://github.com/RevenueCat/purchases-capacitor/commit/92a8cdac3d35108a5403135923767e1f711080a1))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.0 ([5135101](https://github.com/RevenueCat/purchases-capacitor/commit/5135101a2f0d5de97834f7c3537fe43ba90bb554))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.1 ([55e833b](https://github.com/RevenueCat/purchases-capacitor/commit/55e833b8c5bddedad3bb85de16526c41277ef346))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.2 ([fa47a65](https://github.com/RevenueCat/purchases-capacitor/commit/fa47a65d5078a01f46dfce0b6497ab8ad4438147))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.3 ([f65a3a4](https://github.com/RevenueCat/purchases-capacitor/commit/f65a3a4fe4b200cc7c7097bedab563d4651a94c2))
* isssue docgen ([a8fb90e](https://github.com/RevenueCat/purchases-capacitor/commit/a8fb90e4148c68841b9868463ba9a730ea96dc35))

## [2.4.0](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.24...2.4.0) (2023-04-17)


### Features

* add collectDeviceIdentifiers and enableAdServicesAttributionTokenCollection ([14e07c0](https://github.com/RevenueCat/purchases-capacitor/commit/14e07c06ea3f70fbaecb8204ddd995cfaca74ff3))


### Bug Fixes

* build script ([921f631](https://github.com/RevenueCat/purchases-capacitor/commit/921f63178e694e21e8fc9e4baaec328f0ac55ab2))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.7.1 ([2f5b3eb](https://github.com/RevenueCat/purchases-capacitor/commit/2f5b3eb3b31433a665e39814da8b5e952b45cceb))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.8.2 ([c67fb7c](https://github.com/RevenueCat/purchases-capacitor/commit/c67fb7c86abeddeaddaa951bdff81dece67c8bbd))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.0 ([33fb5e7](https://github.com/RevenueCat/purchases-capacitor/commit/33fb5e7f3da181ab6d30b739b4c4c49a7ac383e0))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.5 ([92a8cda](https://github.com/RevenueCat/purchases-capacitor/commit/92a8cdac3d35108a5403135923767e1f711080a1))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.0 ([5135101](https://github.com/RevenueCat/purchases-capacitor/commit/5135101a2f0d5de97834f7c3537fe43ba90bb554))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.1 ([55e833b](https://github.com/RevenueCat/purchases-capacitor/commit/55e833b8c5bddedad3bb85de16526c41277ef346))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.2 ([fa47a65](https://github.com/RevenueCat/purchases-capacitor/commit/fa47a65d5078a01f46dfce0b6497ab8ad4438147))
* isssue docgen ([a8fb90e](https://github.com/RevenueCat/purchases-capacitor/commit/a8fb90e4148c68841b9868463ba9a730ea96dc35))

## [2.3.0](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.24...2.3.0) (2023-04-17)


### Features

* add collectDeviceIdentifiers and enableAdServicesAttributionTokenCollection ([14e07c0](https://github.com/RevenueCat/purchases-capacitor/commit/14e07c06ea3f70fbaecb8204ddd995cfaca74ff3))


### Bug Fixes

* build script ([921f631](https://github.com/RevenueCat/purchases-capacitor/commit/921f63178e694e21e8fc9e4baaec328f0ac55ab2))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.7.1 ([2f5b3eb](https://github.com/RevenueCat/purchases-capacitor/commit/2f5b3eb3b31433a665e39814da8b5e952b45cceb))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.8.2 ([c67fb7c](https://github.com/RevenueCat/purchases-capacitor/commit/c67fb7c86abeddeaddaa951bdff81dece67c8bbd))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.0 ([33fb5e7](https://github.com/RevenueCat/purchases-capacitor/commit/33fb5e7f3da181ab6d30b739b4c4c49a7ac383e0))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.5 ([92a8cda](https://github.com/RevenueCat/purchases-capacitor/commit/92a8cdac3d35108a5403135923767e1f711080a1))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.0 ([5135101](https://github.com/RevenueCat/purchases-capacitor/commit/5135101a2f0d5de97834f7c3537fe43ba90bb554))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.1 ([55e833b](https://github.com/RevenueCat/purchases-capacitor/commit/55e833b8c5bddedad3bb85de16526c41277ef346))
* isssue docgen ([a8fb90e](https://github.com/RevenueCat/purchases-capacitor/commit/a8fb90e4148c68841b9868463ba9a730ea96dc35))

## [2.2.0](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.24...2.2.0) (2023-04-10)


### Features

* add collectDeviceIdentifiers and enableAdServicesAttributionTokenCollection ([14e07c0](https://github.com/RevenueCat/purchases-capacitor/commit/14e07c06ea3f70fbaecb8204ddd995cfaca74ff3))


### Bug Fixes

* build script ([921f631](https://github.com/RevenueCat/purchases-capacitor/commit/921f63178e694e21e8fc9e4baaec328f0ac55ab2))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.7.1 ([2f5b3eb](https://github.com/RevenueCat/purchases-capacitor/commit/2f5b3eb3b31433a665e39814da8b5e952b45cceb))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.8.2 ([c67fb7c](https://github.com/RevenueCat/purchases-capacitor/commit/c67fb7c86abeddeaddaa951bdff81dece67c8bbd))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.0 ([33fb5e7](https://github.com/RevenueCat/purchases-capacitor/commit/33fb5e7f3da181ab6d30b739b4c4c49a7ac383e0))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.5 ([92a8cda](https://github.com/RevenueCat/purchases-capacitor/commit/92a8cdac3d35108a5403135923767e1f711080a1))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.0 ([5135101](https://github.com/RevenueCat/purchases-capacitor/commit/5135101a2f0d5de97834f7c3537fe43ba90bb554))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.1 ([55e833b](https://github.com/RevenueCat/purchases-capacitor/commit/55e833b8c5bddedad3bb85de16526c41277ef346))
* isssue docgen ([a8fb90e](https://github.com/RevenueCat/purchases-capacitor/commit/a8fb90e4148c68841b9868463ba9a730ea96dc35))

## [2.1.0](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.24...2.1.0) (2023-03-27)


### Features

* add collectDeviceIdentifiers and enableAdServicesAttributionTokenCollection ([14e07c0](https://github.com/RevenueCat/purchases-capacitor/commit/14e07c06ea3f70fbaecb8204ddd995cfaca74ff3))


### Bug Fixes

* build script ([921f631](https://github.com/RevenueCat/purchases-capacitor/commit/921f63178e694e21e8fc9e4baaec328f0ac55ab2))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.7.1 ([2f5b3eb](https://github.com/RevenueCat/purchases-capacitor/commit/2f5b3eb3b31433a665e39814da8b5e952b45cceb))
* **deps:** update dependency com.revenuecat.purchases:purchases to v5.8.2 ([c67fb7c](https://github.com/RevenueCat/purchases-capacitor/commit/c67fb7c86abeddeaddaa951bdff81dece67c8bbd))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.0 ([33fb5e7](https://github.com/RevenueCat/purchases-capacitor/commit/33fb5e7f3da181ab6d30b739b4c4c49a7ac383e0))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.13.5 ([92a8cda](https://github.com/RevenueCat/purchases-capacitor/commit/92a8cdac3d35108a5403135923767e1f711080a1))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.0 ([5135101](https://github.com/RevenueCat/purchases-capacitor/commit/5135101a2f0d5de97834f7c3537fe43ba90bb554))
* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.14.1 ([55e833b](https://github.com/RevenueCat/purchases-capacitor/commit/55e833b8c5bddedad3bb85de16526c41277ef346))
* isssue docgen ([a8fb90e](https://github.com/RevenueCat/purchases-capacitor/commit/a8fb90e4148c68841b9868463ba9a730ea96dc35))

### [2.0.24](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.23...2.0.24) (2023-02-02)


### Bug Fixes

* finish migration customerInfo purchaser info ([529e694](https://github.com/RevenueCat/purchases-capacitor/commit/529e694d521736f705d5f0a88a0a3f0b043ee32e))

### [2.0.23](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.22...2.0.23) (2023-02-02)


### Bug Fixes

* use last sdk ([891aad1](https://github.com/RevenueCat/purchases-capacitor/commit/891aad123a1528db570d0d45791969507f08780c))

### [2.0.22](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.21...2.0.22) (2023-01-30)


### Bug Fixes

* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v4.11.0 ([b116df6](https://github.com/RevenueCat/purchases-capacitor/commit/b116df65bdf74aff6a9d44b8de83b48a42f11b48))

### [2.0.21](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.20...2.0.21) (2023-01-30)


### Bug Fixes

* **deps:** update dependency com.revenuecat.purchases:purchases to v5.7.0 ([385d2d4](https://github.com/RevenueCat/purchases-capacitor/commit/385d2d4cde0e544fa5a552b8ab1b7a8495c57ee6))

### [2.0.20](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.19...2.0.20) (2023-01-30)

### [2.0.19](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.18...2.0.19) (2023-01-23)


### Bug Fixes

* **deps:** update dependency com.revenuecat.purchases:purchases to v5.6.7 ([027130a](https://github.com/RevenueCat/purchases-capacitor/commit/027130afdaa53ac0afa72acc040515555e81316f))

### [2.0.18](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.17...2.0.18) (2023-01-19)

### [2.0.17](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.16...2.0.17) (2023-01-18)

### [2.0.16](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.15...2.0.16) (2023-01-18)

### [2.0.15](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.14...2.0.15) (2023-01-12)

### [2.0.14](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.13...2.0.14) (2023-01-12)


### Bug Fixes

* enforce typing for script ([e15b36d](https://github.com/RevenueCat/purchases-capacitor/commit/e15b36ddc9e26b969f899c67ccd044e6f70bd20b))

### [2.0.13](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.12...2.0.13) (2023-01-12)


### Bug Fixes

* trigger ci ([4e3204f](https://github.com/RevenueCat/purchases-capacitor/commit/4e3204f95a8a3ae65d38f0a00b11833dd22caa1b))

### [2.0.12](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.11...2.0.12) (2023-01-12)


### Bug Fixes

* force use latest ([a4cba10](https://github.com/RevenueCat/purchases-capacitor/commit/a4cba109448db55186280400fd6f5dacdf55e98c))

### [2.0.11](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.10...2.0.11) (2023-01-12)


### Bug Fixes

* add dlx to cache ([ce149b8](https://github.com/RevenueCat/purchases-capacitor/commit/ce149b80aa698aebdc984ec6249459e091296843))

### [2.0.10](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.9...2.0.10) (2023-01-12)

### [2.0.9](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.7...2.0.9) (2023-01-12)


### Bug Fixes

* switch to pnpm dlx ([5eda928](https://github.com/RevenueCat/purchases-capacitor/commit/5eda928df6eb77e10c22d5832dd1ed974b38c4b7))

### [2.0.8](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.7...2.0.8) (2023-01-12)

### [2.0.7](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.6...2.0.7) (2023-01-12)

### [2.0.6](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.5...2.0.6) (2023-01-12)


### Bug Fixes

* use new release system ([1470ebf](https://github.com/RevenueCat/purchases-capacitor/commit/1470ebf4906e072c602ac6f87c5fa7e89024586e))

### [2.0.5](https://github.com/RevenueCat/purchases-capacitor/compare/2.0.4...2.0.5) (2023-01-12)


### Bug Fixes

* lint issue ([402c04e](https://github.com/RevenueCat/purchases-capacitor/commit/402c04ea10f89e84723ceeaa3ccb30b079ba76fe))

### [2.0.4](https://github.com/RevenueCat/purchases-capacitor/compare/v2.0.3...v2.0.4) (2023-01-12)


### Bug Fixes

* switch to PurchasesHybridCommon ([904ff0b](https://github.com/RevenueCat/purchases-capacitor/commit/904ff0b73e1d6d5d691c955973e72546913166d7))

### [2.0.3](https://github.com/RevenueCat/purchases-capacitor/compare/v2.0.2...v2.0.3) (2023-01-11)


### Bug Fixes

* add PurchasesHybridCommon in ios ([7370d55](https://github.com/RevenueCat/purchases-capacitor/commit/7370d55b208fa553cd52b16cca0b46edd5c8d0b2))

### [2.0.2](https://github.com/RevenueCat/purchases-capacitor/compare/v2.0.1...v2.0.2) (2023-01-11)


### Bug Fixes

* doc in readme ([301a2ad](https://github.com/RevenueCat/purchases-capacitor/commit/301a2ad6aa3404313c1b3d6a9413c09d45caa5af))

### [2.0.1](https://github.com/RevenueCat/purchases-capacitor/compare/v2.0.0...v2.0.1) (2023-01-11)


### Bug Fixes

* readme add migration steps ([acd8289](https://github.com/RevenueCat/purchases-capacitor/commit/acd82893db1241dec935752c227f986f71103b0a))

## [2.0.0](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.49...v2.0.0) (2023-01-11)


### ⚠ BREAKING CHANGES

* use the new names of PurchaserInfo

### Bug Fixes

* ios build ([9ae6a6e](https://github.com/RevenueCat/purchases-capacitor/commit/9ae6a6e5a5198588afa9568850afd3406d9f1723))
* name productIdentifier ([d75a778](https://github.com/RevenueCat/purchases-capacitor/commit/d75a7788cb4443421ab45e6fc0736d4f7a9f64b5))
* use new restorePurchases name ([49633e4](https://github.com/RevenueCat/purchases-capacitor/commit/49633e4d846520448b247958d79628ac5cb289b8))
* use the new names of PurchaserInfo ([326bff5](https://github.com/RevenueCat/purchases-capacitor/commit/326bff51358f06faa08d8a458d43ee966cd9b8f9))

### [1.3.49](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.48...v1.3.49) (2023-01-11)


### Bug Fixes

* issue with init empty appUserID ([f7501b0](https://github.com/RevenueCat/purchases-capacitor/commit/f7501b02c6aaf3a7cf18c616ae228b8e23198b95))

### [1.3.48](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.47...v1.3.48) (2023-01-11)


### Bug Fixes

* issue ios ([6b0e443](https://github.com/RevenueCat/purchases-capacitor/commit/6b0e44302bc7d5679713cd75a5b56b71b9d7263e))

### [1.3.47](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.46...v1.3.47) (2023-01-11)


### Bug Fixes

* lint script ([b5a0031](https://github.com/RevenueCat/purchases-capacitor/commit/b5a0031692d033afb3bd77f55f627f3034fc1ceb))

### [1.3.46](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.45...v1.3.46) (2023-01-11)


### Bug Fixes

* issue java pnpm ([a3ef050](https://github.com/RevenueCat/purchases-capacitor/commit/a3ef050ebe97767519b2b88958fb728e1bc9f80f))

### [1.3.45](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.44...v1.3.45) (2023-01-11)


### Bug Fixes

* add back lockfile ([c303a34](https://github.com/RevenueCat/purchases-capacitor/commit/c303a344931bd1ff80519cbc2b5b7c51c26e9daa))
* add missing permission in doc ([de750b5](https://github.com/RevenueCat/purchases-capacitor/commit/de750b5879cc416d526ba2ebefe209b35730ca20))
* missing setAttribute ([8f48621](https://github.com/RevenueCat/purchases-capacitor/commit/8f48621d64f47ff75197d31d5d9f809a4f0687c4))
* remove old lock ([645d276](https://github.com/RevenueCat/purchases-capacitor/commit/645d276870a5f86e50a03488d2cf33435bdd0abc))

### [1.3.44](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.43...v1.3.44) (2023-01-04)

### [1.3.43](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.42...v1.3.43) (2023-01-02)

### [1.3.42](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.41...v1.3.42) (2022-12-26)


### Bug Fixes

* **deps:** update dependency com.revenuecat.purchases:purchases to v5.6.6 ([a80dae8](https://github.com/RevenueCat/purchases-capacitor/commit/a80dae80df5496b46ea6cf117a9162aa491f01f7))

### [1.3.41](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.40...v1.3.41) (2022-12-12)

### [1.3.40](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.39...v1.3.40) (2022-12-03)

### [1.3.39](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.38...v1.3.39) (2022-12-03)

### [1.3.38](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.37...v1.3.38) (2022-11-30)

### [1.3.37](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.36...v1.3.37) (2022-11-24)

### [1.3.36](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.35...v1.3.36) (2022-11-24)


### Bug Fixes

* min package version ([9ed57a3](https://github.com/RevenueCat/purchases-capacitor/commit/9ed57a3b01580f23041342501f87505b8c1207ef))

### [1.3.35](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.34...v1.3.35) (2022-11-24)


### Bug Fixes

* android build ([a4d8646](https://github.com/RevenueCat/purchases-capacitor/commit/a4d86469891e292ce59847faafb66926bb9b4fdc))

### [1.3.34](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.33...v1.3.34) (2022-11-24)


### Bug Fixes

* use same as capacitor ([00ec066](https://github.com/RevenueCat/purchases-capacitor/commit/00ec066cee90a7c3fd9b05a9de6c05e7c3786f36))

### [1.3.33](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.32...v1.3.33) (2022-11-24)


### Bug Fixes

* remove jcenter ([4f8e0ad](https://github.com/RevenueCat/purchases-capacitor/commit/4f8e0adba31b8e626c1d84d0386960ac1500773f))

### [1.3.32](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.31...v1.3.32) (2022-11-24)


### Bug Fixes

* android build ([b239d22](https://github.com/RevenueCat/purchases-capacitor/commit/b239d2296d7b4c045e4b8a2877b20e08907aab0a))

### [1.3.31](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.30...v1.3.31) (2022-11-24)


### Bug Fixes

* **deps:** update dependency com.revenuecat.purchases:purchases to v5.6.5 ([7a41ed9](https://github.com/RevenueCat/purchases-capacitor/commit/7a41ed9f30183b5526ad3f275a6a381dcf606bfe))

### [1.3.30](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.29...v1.3.30) (2022-11-24)


### Bug Fixes

* kotlib version issue ([e35a5d6](https://github.com/RevenueCat/purchases-capacitor/commit/e35a5d6ab2703a04a99bc0fb9447cbf11189043c))

### [1.3.29](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.28...v1.3.29) (2022-11-22)


### Bug Fixes

* **deps:** update dependency com.revenuecat.purchases:purchases-hybrid-common to v3.3.0 ([7ac7dc2](https://github.com/RevenueCat/purchases-capacitor/commit/7ac7dc22812a91b7e8aa8b2b58cb1981e99547d8))

### [1.3.28](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.27...v1.3.28) (2022-11-22)


### Bug Fixes

* lint ([09cdf91](https://github.com/RevenueCat/purchases-capacitor/commit/09cdf912c6f212c3f4b203e4d82e909b71f2fc36))

### [1.3.27](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.26...v1.3.27) (2022-11-22)


### Bug Fixes

* android build ([e0d80f4](https://github.com/RevenueCat/purchases-capacitor/commit/e0d80f44015185242abe35288587f6a2a5c9d4b6))

### [1.3.26](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.25...v1.3.26) (2022-11-22)


### Bug Fixes

* **deps:** update dependency com.revenuecat.purchases:purchases to v5.6.4 ([79ce91f](https://github.com/RevenueCat/purchases-capacitor/commit/79ce91f62cac43c1c8cc71c6bfb366bafa0770dd))

### [1.3.25](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.24...v1.3.25) (2022-11-22)


### Bug Fixes

* **deps:** update dependency com.android.tools.build:gradle to v7.3.1 ([f16f19e](https://github.com/RevenueCat/purchases-capacitor/commit/f16f19e993cae027796da9164289960cfb88c4ed))

### [1.3.24](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.23...v1.3.24) (2022-11-22)


### Bug Fixes

* allow oldSKU for android upgrade ([a35807a](https://github.com/RevenueCat/purchases-capacitor/commit/a35807a98578e9af5beed4166c25aea570d16604))

### [1.3.23](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.22...v1.3.23) (2022-11-22)

### [1.3.22](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.21...v1.3.22) (2022-11-22)

### [1.3.21](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.20...v1.3.21) (2022-11-17)


### Bug Fixes

* kotlin vulnerability ([8859810](https://github.com/RevenueCat/purchases-capacitor/commit/88598108085c35385dca76067cc29a6a8064f357))

### [1.3.20](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.19...v1.3.20) (2022-11-11)


### Bug Fixes

* ci script native build ([28ffdef](https://github.com/RevenueCat/purchases-capacitor/commit/28ffdef731a03f91e1af48eef2112c6c893a5744))

### [1.3.19](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.18...v1.3.19) (2022-11-11)


### Bug Fixes

* add ci step ([8b8533d](https://github.com/RevenueCat/purchases-capacitor/commit/8b8533d206d226c31bfd13d1c006c20225873fa4))

### [1.3.18](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.17...v1.3.18) (2022-09-02)


### Bug Fixes

* var init ([29180aa](https://github.com/RevenueCat/purchases-capacitor/commit/29180aa43aae32bfc4ac9a815e2b1e05c3323295))

### [1.3.17](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.16...v1.3.17) (2022-09-02)

### [1.3.16](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.15...v1.3.16) (2022-08-29)

### [1.3.15](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.14...v1.3.15) (2022-08-21)


### Bug Fixes

* readme ([66989a6](https://github.com/RevenueCat/purchases-capacitor/commit/66989a6ce748097020b1e7027ef39490faa0b566))

### [1.3.14](https://github.com/RevenueCat/purchases-capacitor/compare/v1.3.13...v1.3.14) (2022-08-19)


### Bug Fixes

* upgrade to latest plugin template ([65e5fc3](https://github.com/RevenueCat/purchases-capacitor/commit/65e5fc337386e1b284547aa90116f7df6cfff739))

### [1.3.13](https://github.com/riderx/purchases-capacitor/compare/v1.3.12...v1.3.13) (2022-08-05)


### Bug Fixes

* peer allow capacitor v4 ([d25db8d](https://github.com/riderx/purchases-capacitor/commit/d25db8d61657369e24f911e6394e53e9b34d6b88))

### [1.3.12](https://github.com/riderx/purchases-capacitor/compare/v1.3.11...v1.3.12) (2022-07-31)


### Bug Fixes

* missing file in npm ([5c40199](https://github.com/riderx/purchases-capacitor/commit/5c40199e96375067a916d4b602f553caada77260))

### [1.3.11](https://github.com/riderx/purchases-capacitor/compare/v1.3.10...v1.3.11) (2022-07-28)


### Bug Fixes

* rename ([f902d4f](https://github.com/riderx/purchases-capacitor/commit/f902d4f9bd8b55137c106d4569c99ff2c4fc818e))

### [1.3.10](https://github.com/riderx/purchases-capacitor/compare/v1.3.9...v1.3.10) (2022-07-28)


### Bug Fixes

* for rename ([c21c896](https://github.com/riderx/purchases-capacitor/commit/c21c896321a97eaf23a9897138e4d178779a5239))

### [1.3.9](https://github.com/riderx/purchases-capacitor/compare/v1.3.8...v1.3.9) (2022-07-24)


### Bug Fixes

* CI loop ([9ad4ee4](https://github.com/riderx/purchases-capacitor/commit/9ad4ee42293af3f814db003ec133a02643ebdfad))

### [1.3.8](https://github.com/riderx/purchases-capacitor/compare/v1.3.7...v1.3.8) (2022-07-24)

### [1.3.7](https://github.com/riderx/purchases-capacitor/compare/v1.3.6...v1.3.7) (2022-07-24)

### [1.3.6](https://github.com/riderx/purchases-capacitor/compare/v1.3.5...v1.3.6) (2022-07-24)

### [1.3.5](https://github.com/riderx/purchases-capacitor/compare/v1.3.4...v1.3.5) (2022-07-24)

### [1.3.4](https://github.com/riderx/purchases-capacitor/compare/v1.3.3...v1.3.4) (2022-07-24)

### [1.3.3](https://github.com/riderx/purchases-capacitor/compare/v1.3.2...v1.3.3) (2022-07-24)

### [1.3.2](https://github.com/riderx/purchases-capacitor/compare/v1.3.1...v1.3.2) (2022-07-24)

### [1.3.1](https://github.com/riderx/purchases-capacitor/compare/v1.3.0...v1.3.1) (2022-07-24)

## 1.3.0 (2022-07-24)


### Features

* add CI system ([1330ae5](https://github.com/riderx/purchases-capacitor/commit/1330ae54c4f835d3cc849d1e0cb0a0f7e5b694be))
* add ios target ([0f2ff3a](https://github.com/riderx/purchases-capacitor/commit/0f2ff3a5c782d6e5ff83d2d55ba1a0eb15c8ecc0))
* add mock value for web ([3a92fb9](https://github.com/riderx/purchases-capacitor/commit/3a92fb9031838265c7f0696cd3e03f063c79041b))
* RevenueCat 4.3.0 ([1be64cb](https://github.com/riderx/purchases-capacitor/commit/1be64cbb90f2eeca64c8147cca662d38881e3299))
* update to beta 8 in ios ([10c6883](https://github.com/riderx/purchases-capacitor/commit/10c6883044fa5ee0f25adec894cb2b86b1b1e170))
* update to ios rc.2 ([015b698](https://github.com/riderx/purchases-capacitor/commit/015b69851457671b221e90fcd502b1bc0472c4e9))
* upgrade android to latest ([9e59844](https://github.com/riderx/purchases-capacitor/commit/9e59844b30aa36a0a34552d44e75ea8c1553a535))


### Bug Fixes

* access ([984771f](https://github.com/riderx/purchases-capacitor/commit/984771f50a7c77c2bc4f394f27c320221a15dbf1))
* android issue ([8bfc8df](https://github.com/riderx/purchases-capacitor/commit/8bfc8df144778f1e7958ce0d1c45a4b16371eb36))
* android missing currencySymbol and wrong title ([1863b34](https://github.com/riderx/purchases-capacitor/commit/1863b34cf7b3c3d85a7dd435839d8ed5c717870b))
* android ourchases ([5a41576](https://github.com/riderx/purchases-capacitor/commit/5a4157670c45d689c28cecd934b9514a7999aab4))
* androidxCoreVersion ([1b9bb39](https://github.com/riderx/purchases-capacitor/commit/1b9bb392ee11c794aa0d990aae38c13e71701d32)), closes [#3](https://github.com/riderx/purchases-capacitor/issues/3)
* app name issue in title ([41d1ddf](https://github.com/riderx/purchases-capacitor/commit/41d1ddf8868ce89dc586a8c571e75973bc73600e))
* better typing in swift ([6e590b2](https://github.com/riderx/purchases-capacitor/commit/6e590b2585838a4d4d6bfbcb3318c2559c6a2b40))
* build issue use new RevenueCat beta framework ([ab22f25](https://github.com/riderx/purchases-capacitor/commit/ab22f2532b002b75b5d9764a904f2cbe6faf1713))
* CI ([6b5ae75](https://github.com/riderx/purchases-capacitor/commit/6b5ae756b5e2ac7c18eddf10be9a14d011917e01))
* crash issue ([26773ad](https://github.com/riderx/purchases-capacitor/commit/26773ad4f8bbd7c5100876b594b7545c0db0263f))
* definitions use new naming ([5e8d56a](https://github.com/riderx/purchases-capacitor/commit/5e8d56a670013193d35016a40225fed76d9b079f))
* discount in ios ([d2eafb8](https://github.com/riderx/purchases-capacitor/commit/d2eafb8db51e9546835c540c281fd5c2ee321628))
* double deep object issue ([4c328b9](https://github.com/riderx/purchases-capacitor/commit/4c328b9b41c73a81db1aee1671f45411d9659141))
* few error in swift ([945cb8d](https://github.com/riderx/purchases-capacitor/commit/945cb8d5216d418043704e13834219aa9cc5c3fe))
* introductoryPrice return null in ios like android ([c5f81e5](https://github.com/riderx/purchases-capacitor/commit/c5f81e5a0078e00b30fc334263471852b864fca4))
* ios issue in purchase ([318e64c](https://github.com/riderx/purchases-capacitor/commit/318e64c498a0d48ccdd12dc1224c4e7498b9ed8d))
* issue AppName ([7dc32c9](https://github.com/riderx/purchases-capacitor/commit/7dc32c920e09c47f6eefd3690ca69ff0db16352e))
* issue StoreProductDiscount ([f276a26](https://github.com/riderx/purchases-capacitor/commit/f276a26f29dff00cb3e586af904e0067a7f15d94))
* issue with latest hybrid ([0da2beb](https://github.com/riderx/purchases-capacitor/commit/0da2bebb5e78d4fafd4022c01d32e53838d6759e))
* json conversion ([b3183dd](https://github.com/riderx/purchases-capacitor/commit/b3183dda8c31f06ef3e2c02fe524cefa7867ade2))
* key formating android ([48b2a98](https://github.com/riderx/purchases-capacitor/commit/48b2a9811274e7440b3b7937b1abc6c52cfe2d5c))
* Login res android ([4fbc42c](https://github.com/riderx/purchases-capacitor/commit/4fbc42c77dca9019ec5ee5620802dd843f79f9ca))
* migrate doc to capgo org ([65a4176](https://github.com/riderx/purchases-capacitor/commit/65a41768f59021391ceaf311fb21596ac7ba022e))
* missing configs ([e26dd25](https://github.com/riderx/purchases-capacitor/commit/e26dd25632ee1a4b2bd044c48e7c8d272cf8aed7))
* mock data add montly ([c09243f](https://github.com/riderx/purchases-capacitor/commit/c09243ff909dc8942c76709f9385e5339b5cc8c6))
* mocked data ([2672be6](https://github.com/riderx/purchases-capacitor/commit/2672be643e3f81f4560c78b93b74a17c4ff979fb))
* naming issue ([bd790db](https://github.com/riderx/purchases-capacitor/commit/bd790dba03cff00b5ce3b4e6433a5942c4bf5606))
* product field ([46848c5](https://github.com/riderx/purchases-capacitor/commit/46848c56e5d555891696e0a246179175e7614fb2))
* purchasePackage method in ios ([08a3c3b](https://github.com/riderx/purchases-capacitor/commit/08a3c3b783f7949f1625d34c65ac83f7fe212c02))
* purchasePackage return value ([44e0822](https://github.com/riderx/purchases-capacitor/commit/44e0822a860940b710913712b2e64948ae0ad3ba))
* remove custom pricestring for discount ([9d42d66](https://github.com/riderx/purchases-capacitor/commit/9d42d662849cb66ec8c97caaa2f2853310f18fba))
* remove log ([6367f16](https://github.com/riderx/purchases-capacitor/commit/6367f161dc2f14eef827bbf07623e2533f6d4dce))
* remove old field ([91c780a](https://github.com/riderx/purchases-capacitor/commit/91c780af0f9eeb702a20128b185e5a1118e6c4ed))
* remove typo in swift ([7c05f0e](https://github.com/riderx/purchases-capacitor/commit/7c05f0e114519fe2ea2142f7fa2e0fd9344ff1de))
* remove useless ([5d89d01](https://github.com/riderx/purchases-capacitor/commit/5d89d01833e6a06d47a1edc9881a34afb9402ae1))
* remove useless description in offering ([19c72da](https://github.com/riderx/purchases-capacitor/commit/19c72daa0d658a71df8e968894130ee9b5e76713))
* remove useless test ([e8297e3](https://github.com/riderx/purchases-capacitor/commit/e8297e381bb7aa49bb67b44c543bd87a66c4f0aa))
* res android ([fe89d5b](https://github.com/riderx/purchases-capacitor/commit/fe89d5bcab5e885483cf65b1d21410c5b3847db5))
* res data for restaure ([d5440ae](https://github.com/riderx/purchases-capacitor/commit/d5440ae323ff4f4828e0aedb8605ae52453ec2e7))
* revert return type for empty values ([7d87afc](https://github.com/riderx/purchases-capacitor/commit/7d87afccd20d0ed2d31c8bdae572525521a610ec))
* swift package ([11453eb](https://github.com/riderx/purchases-capacitor/commit/11453eb45e0b5014e8f248046e5f37efbe633180))
* typo version number ([5340e0c](https://github.com/riderx/purchases-capacitor/commit/5340e0c588b7fcd1f3a28609e653625b90d65592))
* update latest ([544b5c6](https://github.com/riderx/purchases-capacitor/commit/544b5c68f3126720b7ac72d33a3b63e859e21c12))
* update version number for android patch ([372e081](https://github.com/riderx/purchases-capacitor/commit/372e0818aa5ec1b7e68f67c52d9dfb26317cc7a7))
* use last rc ([8c9300b](https://github.com/riderx/purchases-capacitor/commit/8c9300b455b0e8bbb9b8dec814571f4bd77cabe0))
* use new org ([e8836a7](https://github.com/riderx/purchases-capacitor/commit/e8836a7880843c7e32e152e66b876135b2316aa6))
* use reject instead of resolve for errors ([9e4d86d](https://github.com/riderx/purchases-capacitor/commit/9e4d86da3ec613382d34809ad8b3443f0c8281c9))
* version number ([4614954](https://github.com/riderx/purchases-capacitor/commit/46149542cd0d1e246b44831455b70a7c608e5a80))

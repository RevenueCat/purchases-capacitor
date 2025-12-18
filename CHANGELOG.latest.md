> [!WARNING]  
> If you don't have any login system in your app, please make sure your one-time purchase products have been correctly configured in the RevenueCat dashboard as either consumable or non-consumable. If they're incorrectly configured as consumables, RevenueCat will consume these purchases. This means that users won't be able to restore them from version 11.0.0 onward.
> Non-consumables are products that are meant to be bought only once, for example, lifetime subscriptions.


## RevenueCat SDK
### 🐞 Bugfixes
* Fix `getCurrentOfferingForPlacement` failing for null offerings in iOS (#628) via Toni Rico (@tonidero)
### 📦 Dependency Updates
* [AUTOMATIC BUMP] Updates purchases-hybrid-common to 17.24.0 (#626) via RevenueCat Git Bot (@RCGitBot)
  * [Android 9.15.5](https://github.com/RevenueCat/purchases-android/releases/tag/9.15.5)
  * [Android 9.15.4](https://github.com/RevenueCat/purchases-android/releases/tag/9.15.4)
  * [iOS 5.50.1](https://github.com/RevenueCat/purchases-ios/releases/tag/5.50.1)
* [RENOVATE] Update dependency com.android.tools.build:gradle to v8.13.2 (#625) via RevenueCat Git Bot (@RCGitBot)

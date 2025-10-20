> [!WARNING]  
> If you don't have any login system in your app, please make sure your one-time purchase products have been correctly configured in the RevenueCat dashboard as either consumable or non-consumable. If they're incorrectly configured as consumables, RevenueCat will consume these purchases. This means that users won't be able to restore them from version 11.0.0 onward.
> Non-consumables are products that are meant to be bought only once, for example, lifetime subscriptions.


## RevenueCat SDK
### 🐞 Bugfixes
* Fix passing offering to `presentPaywall` functions (#572) via Toni Rico (@tonidero)

### 🔄 Other Changes
* Bump fastlane-plugin-revenuecat_internal from `25c7fb8` to `525d48c` (#571) via dependabot[bot] (@dependabot[bot])

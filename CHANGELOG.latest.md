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

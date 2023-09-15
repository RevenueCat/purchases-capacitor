**RevenueCat Capacitor SDK v6** is here!! 😻

This is the first release of this SDK after RevenueCat took over development. We have moved the plugin to:
```
@revenuecat/purchases-capacitor
```

This release updates the SDK to use BillingClient 5 in Android. This version of BillingClient brings an entire new subscription model which has resulted in large changes across the entire SDK.

Additionally, we have added a lot of new functionality previously not supported on this plugin.

## Migration Guides
- See the full list of API changes in [our v6 migration doc](migrations/v6-MIGRATION.md)

- See [Android Native - 5.x to 6.x Migration](https://www.revenuecat.com/docs/android-native-5x-to-6x-migration) for a
  more thorough explanation of the new Google subscription model announced with BillingClient 5 and how to take
  advantage of it in V6. This guide includes tips on product setup with the new model.

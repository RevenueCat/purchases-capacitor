## 0.1.0
- Updates iOS SDK to 2.3.0. Check out the changelog for a full list of changes https://github.com/RevenueCat/purchases-ios/releases/tag/2.3.0
- Updates Android SDK to 2.2.2. Check out the changelog for a full list of changes https://github.com/RevenueCat/purchases-android/releases/tag/2.2.2
- ** BREAKING CHANGE ** makePurchase parameter oldSKUs is not an array anymore, it only accepts a string now. This is due to changes in the BillingClient.
- AddAttributionData can be called before the SDK has been setup. A network user identifier can be send to the addAttribution function, replacing the previous rc_appsflyer_id parameter. 
- Adds an optional configuration boolean observerMode. This will set the value of finishTransactions at configuration time.
### Android only:
- addAttribution will automatically add the rc_gps_adid parameter.
- ** ANDROID BREAKING CHANGE ** Call syncTransactions to send purchases information to RevenueCat after any restore or purchase if you are using the SDK in observerMode. See our guide on Migrating Subscriptions for more information on syncTransactions: https://docs.revenuecat.com/docs/migrating-existing-subscriptions
### iOS only
- addAttribution will automatically add the rc_idfa and rc_idfv parameters if the AdSupport and UIKit frameworks are included, respectively.
- Apple Search Ad attribution can be automatically collected by setting the automaticAttributionCollection boolean to true before the SDK is configured.
- Other bugfixes

## 0.0.8

- Updates iOS SDK to 2.1.1

## 0.0.7

- Fixes exception on iOS when sending an error

## 0.0.6

- Fixes errors in Android not being sent as int
- Fixes crash when underlyingErrorMessage is missing

## 0.0.5

- Updates versions to 2.1.0 with the new error handling.
- **Breaking** change, the errors have changed and now return an underlyingErrorMessage instead of the domain.
- Removes the preinstall hook that was causing errors in Windows. 0.0.4 version was broken for some. The iOS framework will be included in the repo from now on.
- **Breaking** the error callback of makePurchase now returns an error and a boolean indicating if the user cancelled.

## 0.0.4

- Fixes windows by skipping installation of iOS download script if not building for iOS.

## 0.0.3

- Removes `onDestroy` Android's Activity lifecycle hook since it was closing the instance.

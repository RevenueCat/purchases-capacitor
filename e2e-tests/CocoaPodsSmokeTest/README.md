# Internal Git-sourced CocoaPods smoke check

This committed Capacitor app installs both wrapper packages from the checkout.
Its Podfile explicitly pins RevenueCat, RevenueCatUI, PurchasesHybridCommon and
PurchasesHybridCommonUI to compatible Git sources. CI checks the existing core/UI
installation fixtures, then syncs this app twice and compares its Podfile.

The app configures Purchases with a fake key, asserts `getAppUserID()` through the
native bridge and verifies the UI plugin is registered. Maestro checks the success
marker; CI also verifies core/UI resource bundles. No backend credentials are needed.

SPM is the supported Apple installation route. This fixture exercises the internal
legacy workaround. Before merging `15.0-dev` into main, replace the PHC branch with
its release tag in all three Podfiles (SDK-4604). The PHC bump lane maintains future
PHC/native version pins.

# @revenuecat/purchases-capacitor-ui

UI components for RevenueCat Capacitor SDK. This plugin extends the functionality of the [@revenuecat/purchases-capacitor](https://github.com/RevenueCat/purchases-capacitor) plugin to provide UI components for displaying paywalls and customer center.

## Platform Support

> ⚠️ **IMPORTANT: Platform Limitations**
>
> - **iOS**: Paywalls and Customer Center are fully supported on iOS 15.0+
> - **Android**: Paywalls and Customer Center are now fully supported on Android 7.0+ (API level 24+)
> - **Web**: Not supported

## Install

```bash
npm install @revenuecat/purchases-capacitor
npm install @revenuecat/purchases-capacitor-ui
npx cap sync
```

> Note: Make sure to use the same version for both `@revenuecat/purchases-capacitor` and `@revenuecat/purchases-capacitor-ui`.

## iOS Configuration

For iOS, you need to add SwiftUI to your app's capabilities. Follow the [iOS SDK's SwiftUI Configuration](https://github.com/RevenueCat/purchases-ios-ui#swift-package-manager) guide for details.

## API

<docgen-index>

- [`presentPaywall(...)`](#presentpaywall)
- [`presentPaywallIfNeeded(...)`](#presentpaywallIfNeeded)
- [`presentCustomerCenter()`](#presentcustomercenter)
- [`addListener('paywallDisplayed', ...)`](#addlistenerpaywallDisplayed)
- [`addListener('paywallDismissed', ...)`](#addlistenerpaywallDismissed)
- [`removeAllListeners()`](#removealllisteners)
- [Interfaces](#interfaces)
- [Enums](#enums)

</docgen-index>

<docgen-api>
<!--Update with API docs-->
</docgen-api>

## Usage

### Initialization

First, initialize the main RevenueCat SDK:

```typescript
import { Purchases } from '@revenuecat/purchases-capacitor';

// Initialize the SDK
await Purchases.configure({
  apiKey: 'your_api_key',
});
```

### Presenting Paywalls

```typescript
import { Purchases } from '@revenuecat/purchases-capacitor';
import { RevenueCatUI } from '@revenuecat/purchases-capacitor-ui';

const offering = (await Purchases.getOfferings()).current;

// Present a paywall with the default offering
const result = await RevenueCatUI.presentPaywall();

// Present a paywall with a specific offering
const result = await RevenueCatUI.presentPaywall({
  offering,
  displayCloseButton: true,
});

// Present a fullscreen paywall on all platforms
import { PaywallPresentationConfiguration } from '@revenuecat/purchases-capacitor-ui';
const result = await RevenueCatUI.presentPaywall({
  presentationConfiguration: PaywallPresentationConfiguration.FULL_SCREEN,
});

// Present a paywall only if the user doesn't have a specific entitlement
const result = await RevenueCatUI.presentPaywallIfNeeded({
  requiredEntitlementIdentifier: 'pro_access',
  offering,
});
```

### Customer Center

```typescript
import { RevenueCatUI } from '@revenuecat/purchases-capacitor-ui';

// Present the customer center
await RevenueCatUI.presentCustomerCenter();
```

### Checkpoints (experimental, invite-only)

A checkpoint gates navigation with a dashboard-defined flow. Configure Purchases first.
Requires iOS 15+ or Android; web is unsupported, including mock web mode.

```typescript
import { RevenueCatUI, FLOW_PRESENTATION_MODE } from '@revenuecat/purchases-capacitor-ui';

const remove = await RevenueCatUI.checkpoint(
  'upgrade',
  (result) => {
    // Continue only from this callback. result.flow is null if nothing needed presenting.
    console.log(result.customer, result.flow);
  },
  {
    customVariables: { level: 12, premium: false },
    presentationMode: FLOW_PRESENTATION_MODE.MODAL_SHEET,
  },
);

// When the owning screen unmounts:
await remove();
```

Continue your app inside the callback passed as the second argument to `checkpoint()`.
The callback runs at most once, when the checkpoint lets the user continue.
It won't run if the user dismisses the flow, an error blocks it, or another
checkpoint is already presenting. Errors are shown in native SDK dialogs.

`await RevenueCatUI.checkpoint(...)` waits for setup and returns `remove`. Setup errors
reject the promise. Call `await remove()` when the screen closes to stop listening for the
callback. It is safe to call more than once. It does not dismiss the flow or pass the checkpoint.

`CheckpointResult` contains `customer: CustomerInfo` and `flow: FlowResult | null`. A flow
contains `obtainedEntitlements` (each with `entitlementInfo`) and `obtainedProducts` (each with
`product`). Presentation modes are `DEFAULT`, `MODAL_FULL_SCREEN`, and `MODAL_SHEET`.

## Demo

Here's a quick demo of Paywalls running on iOS:

![iOS Paywalls Demo](./assets/ios-paywalls-demo.mp4)

> Note: To view the demo, please download the MP4 file from the assets directory.

## Events

You can listen for paywall events:

```typescript
import { RevenueCatUI } from '@revenuecat/purchases-capacitor-ui';

// Listen for when a paywall is displayed
RevenueCatUI.addListener('paywallDisplayed', () => {
  console.log('Paywall displayed');
});

// Listen for when a paywall is dismissed
RevenueCatUI.addListener('paywallDismissed', () => {
  console.log('Paywall dismissed');
});
```

## License

MIT

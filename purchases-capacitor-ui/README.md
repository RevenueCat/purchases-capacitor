# @revenuecat/purchases-capacitor-ui

UI components for RevenueCat Capacitor SDK. This plugin extends the functionality of the [@revenuecat/purchases-capacitor](https://github.com/RevenueCat/purchases-capacitor) plugin to provide UI components for displaying paywalls and customer center.

## Install

```bash
npm install @revenuecat/purchases-capacitor
npm install @revenuecat/purchases-capacitor-ui
npx cap sync
```

> Note: Make sure to use the same version for both `@revenuecat/purchases-capacitor` and `@revenuecat/purchases-capacitor-ui`.

## API

<docgen-index>

* [`presentPaywall(...)`](#presentpaywall)
* [`presentPaywallIfNeeded(...)`](#presentpaywallIfNeeded)
* [`presentCustomerCenter()`](#presentcustomercenter)
* [`addListener('paywallDisplayed', ...)`](#addlistenerpaywallDisplayed)
* [`addListener('paywallDismissed', ...)`](#addlistenerpaywallDismissed)
* [`removeAllListeners()`](#removealllisteners)
* [Interfaces](#interfaces)
* [Enums](#enums)

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
import { RevenueCatUI } from '@revenuecat/purchases-capacitor-ui';

// Present a paywall with the default offering
const result = await RevenueCatUI.presentPaywall();

// Present a paywall with a specific offering
const result = await RevenueCatUI.presentPaywall({
  offeringIdentifier: 'premium',
  displayCloseButton: true
});

// Present a paywall only if the user doesn't have a specific entitlement
const result = await RevenueCatUI.presentPaywallIfNeeded({
  requiredEntitlementIdentifier: 'pro_access',
  offeringIdentifier: 'premium'
});
```

### Customer Center

```typescript
import { RevenueCatUI } from '@revenuecat/purchases-capacitor-ui';

// Present the customer center
await RevenueCatUI.presentCustomerCenter();
```

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
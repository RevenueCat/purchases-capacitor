# Maestro E2E Test App

A minimal Capacitor app used by Maestro end-to-end tests to verify RevenueCat SDK integration.

## Prerequisites

- Node.js & npm
- Xcode (iOS) / Android Studio (Android)
- [Maestro](https://maestro.mobile.dev/) CLI
- CocoaPods (`gem install cocoapods`)

## Setup

```bash
npm install
npm run build
npx cap sync
```

## Running Locally

```bash
# iOS
npx cap open ios
# Then build and run from Xcode

# Android
npx cap open android
# Then build and run from Android Studio
```

## API Key

The app initialises RevenueCat with the placeholder `MAESTRO_TESTS_REVENUECAT_API_KEY`.
In CI, the Fastlane lane replaces this placeholder with the real key from the
`RC_E2E_TEST_API_KEY_PRODUCTION_TEST_STORE` environment variable (provided by the
CircleCI `e2e-tests` context) before building.

To run locally, either:
- Replace the placeholder in `src/app.ts` with a valid API key (do **not** commit it), or
- Export the env var and run the same `sed` command the Fastlane lane uses.

## RevenueCat Project

The test uses a RevenueCat project configured with:
- A **V2 Paywall** (the test asserts "Paywall V2" is visible)
- A `pro` entitlement (the test checks entitlement status after purchase)
- The **Test Store** environment for purchase confirmation

## Dependencies

`@revenuecat/purchases-capacitor` and `@revenuecat/purchases-capacitor-ui` are
referenced as local `file:` dependencies so the E2E tests always exercise the code
on the current branch, not a published npm version.

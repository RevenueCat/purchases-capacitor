# Maestro E2E Test App

A minimal Capacitor app used by Maestro end-to-end tests to verify RevenueCat SDK integration.

## Prerequisites

- Node.js & npm
- Xcode (iOS) / Android Studio (Android)
- [Maestro](https://maestro.mobile.dev/) CLI

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

## Test Flow Launch Argument

To keep Maestro flows short and decoupled from the UI, the app reads an
`e2e_test_flow` launch argument on startup and jumps straight to the matching
screen. If the argument is absent or unknown, the app falls back to the
"Test Cases" list.

Maestro passes it via [`launchApp.arguments`](https://maestro.mobile.dev/api-reference/commands/launchapp):

```yaml
- launchApp:
    arguments:
        e2e_test_flow: purchase_through_paywall
```

Each platform has a thin `LaunchArgs` Capacitor plugin that exposes the value
to the web layer:

- **iOS** (`ios/App/App/LaunchArgsPlugin.swift`): reads the value from
  `UserDefaults.standard` using the `e2e_test_flow` key. Maestro's `arguments`
  map is forwarded to the process as `NSUserDefaults` entries.
- **Android** (`android/app/src/main/java/com/revenuecat/automatedsdktests/LaunchArgsPlugin.java`):
  reads the value from the launch `Intent`'s string extras using the
  `e2e_test_flow` key. Maestro's `arguments` map is forwarded as Intent extras.

### Adding a new test flow

1. Add a new screen function in [`src/app.ts`](src/app.ts) (or reuse an
   existing one).
2. Add an entry to `TEST_CASES` in [`src/app.ts`](src/app.ts), keyed by the
   flow value you plan to pass from Maestro, with the title shown in the Test
   Cases list and the screen function to invoke.
3. In the Maestro YAML, set `launchApp.arguments.e2e_test_flow` to the same
   key.

## RevenueCat Project

The test uses a RevenueCat project configured with:
- A **V2 Paywall** (the test asserts "Paywall V2" is visible)
- A `pro` entitlement (the test checks entitlement status after purchase)
- The **Test Store** environment for purchase confirmation

## Dependencies

`@revenuecat/purchases-capacitor` and `@revenuecat/purchases-capacitor-ui` are
referenced as local `file:` dependencies so the E2E tests always exercise the code
on the current branch, not a published npm version.

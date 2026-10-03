# Capacitor SDK update tests

Created by Antonio Pallares.

This small HTML/TypeScript app exercises `@revenuecat/purchases-capacitor`. It creates an anonymous
or logged-in customer, purchases a subscription, and checks the same customer after installing an
app built against the local checkout over the released build.

## Builds

```sh
bundle exec fastlane build_sdk_update_test_apps platform:ios
bundle exec fastlane build_sdk_update_test_apps platform:android
```

Set `WORKFLOWS_TEST_STORE_API_KEY` to the **Workflows Test Store** project's key. CI obtains it from
the `maestro` context, following purchases-android. The offering must be `no_paywall`, with the
`$rc_monthly` package containing `pro_monthly_subscription` and granting `pro`. The app checks the
offering and product before purchasing. Keys are written only into ignored build output.

The shared release-discovery action selects the latest stable release at or below the checkout's
version. Each platform builds separate `release` and `local` apps under `build/sdk_update_tests`.
The release uses the npm registry artifact; the local build links this SDK checkout. Lockfile,
native wrapper version, and actual SwiftPM/Gradle dependency checks reject an incorrect selection.
Each version retains its own declared native dependencies. `version.txt`, `source.txt`, and
dependency reports identify what was built, including when both versions have the same number.

Both apps use `com.revenuecat.SDKUpdateTester`. Android debug builds share the job's debug keystore,
with version codes 1 and 2. CI passes apps through its workspace and publishes only diagnostic
reports, logs, and screenshots as artifacts.

## Running the update

Boot one iOS simulator or Android emulator, then run both cases separately:

```sh
bundle exec fastlane run_sdk_update_test platform:ios test_case:anonymous_user
bundle exec fastlane run_sdk_update_test platform:ios test_case:logged_in_user
bundle exec fastlane run_sdk_update_test platform:android test_case:anonymous_user
bundle exec fastlane run_sdk_update_test platform:android test_case:logged_in_user
```

The shared runner installs the released app, runs `before_update.yaml`, installs the local app
without clearing its data, and runs `after_update.yaml`. It resets state between cases and retries,
creates a unique login ID per attempt, and writes per-case JUnit and diagnostics under
`fastlane/test_output/sdk_update_tests`. `max_attempts` defaults to 3 and must be positive.

These flows adapt the native SDK flows' selectors to visible text, following the existing
Capacitor E2E tests: iOS WebViews do not expose HTML element IDs to Maestro. Both platforms use the
same Capacitor YAML files, screenshot assertions, and top-aligned labels. The custom native plugin
only reads the login launch argument; all SDK calls and UI state live in TypeScript. After the
update, the app neither logs in nor purchases again.

Normal test and release gates run both platforms. The CircleCI `sdk-update-tests` pipeline action
runs only these jobs on demand; the `maestro_e2e_tests` schedule also runs them. Each platform builds
both variants in one job, then runs both user cases in separate steps, including the second case
when the first fails.

## Coverage limitation

An online customer-info refresh can recover entitlements from the server and hide a lost local
entitlement cache. These screenshot checks cover identity and entitlement continuity after an
update; they do not prove offline cache preservation. Stronger offline/cache assertions should be
coordinated across the SDKs and their shared flows.

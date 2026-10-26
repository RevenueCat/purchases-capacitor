fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

### bump

```sh
[bundle exec] fastlane bump
```

Bump version, edit changelog, and create pull request

### automatic_bump

```sh
[bundle exec] fastlane automatic_bump
```

Automatically bumps version, edit changelog, and create pull request

### github_release

```sh
[bundle exec] fastlane github_release
```

Make github release

### temporary_bump_version

```sh
[bundle exec] fastlane temporary_bump_version
```

Temporarily bumps the version of the package to the next snapshot version, but does not commit or push the changes

### release

```sh
[bundle exec] fastlane release
```

Creates GitHub release and publishes package

### release_purchases_capacitor_ui

```sh
[bundle exec] fastlane release_purchases_capacitor_ui
```

Create purchases-capacitor-ui release

### change_purchase_tester_api_key

```sh
[bundle exec] fastlane change_purchase_tester_api_key
```

Change purchase tester API key

### build_purchase_tester

```sh
[bundle exec] fastlane build_purchase_tester
```

Build purchase tester

### build_and_open_purchase_tester_xcode

```sh
[bundle exec] fastlane build_and_open_purchase_tester_xcode
```

Build purchase tester and opens it in Xcode to run in iOS

### build_and_open_purchase_tester_android_studio

```sh
[bundle exec] fastlane build_and_open_purchase_tester_android_studio
```

Build purchase tester and opens it in Android Studio to run in Android

### update_hybrid_common

```sh
[bundle exec] fastlane update_hybrid_common
```

Update purchases-hybrid-common version, pushes changes to a new branch if open_pr option is true

### change_maestro_test_app_api_key

```sh
[bundle exec] fastlane change_maestro_test_app_api_key
```

Replace the Maestro test app API key placeholder

### build_maestro_test_app

```sh
[bundle exec] fastlane build_maestro_test_app
```

Build the Maestro E2E test app for the given platform (platform:ios or platform:android)

### run_maestro_e2e_tests_ios

```sh
[bundle exec] fastlane run_maestro_e2e_tests_ios
```

Run maestro E2E tests on iOS (build_maestro_test_app must have been run beforehand and a booted simulator is required)

### run_maestro_e2e_tests_android

```sh
[bundle exec] fastlane run_maestro_e2e_tests_android
```

Run maestro E2E tests on Android (build_maestro_test_app must have been run beforehand and a running emulator is required)

### build_sdk_update_test_apps

```sh
[bundle exec] fastlane build_sdk_update_test_apps
```

Build released and local Capacitor SDK update test apps

### run_sdk_update_test

```sh
[bundle exec] fastlane run_sdk_update_test
```

Run a Capacitor SDK update Maestro test case

### tag_current_branch

```sh
[bundle exec] fastlane tag_current_branch
```

Tag current branch with current version number

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).

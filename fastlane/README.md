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

### build_ui_package

```sh
[bundle exec] fastlane build_ui_package
```

Build purchases-capacitor-ui package

### update_hybrid_common

```sh
[bundle exec] fastlane update_hybrid_common
```

Update purchases-hybrid-common version, pushes changes to a new branch if open_pr option is true

### tag_current_branch

```sh
[bundle exec] fastlane tag_current_branch
```

Tag current branch with current version number

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).

# Checkpoint error-host smoke tests

These are spike fixtures, not the production SDK test suite. They use a synthetic native modal, so they need no API key, dashboard checkpoint or purchase. Each test checks the native unconfigured-checkpoint rejection, then shows and acknowledges app-owned DOM errors three times and verifies that the original page remains usable.

Build the root SDK, UI package and tester app first. From `example/purchase-tester`, run `npx cap sync`. This may update generated local Capacitor files; those changes are not part of the spike.

## iOS

Requires Xcode, a booted iOS simulator and the `xcodeproj` Ruby gem (also installed by CocoaPods). Run these commands from the repository root, setting `CHECKPOINT_SIMULATOR_ID` to a device from `xcrun simctl list devices booted`:

```sh
ruby example/purchase-tester/checkpoint-smoke/ios/create-project.rb
xcodebuild -project example/purchase-tester/ios/App/App.xcodeproj -scheme App \
  -destination "platform=iOS Simulator,id=$CHECKPOINT_SIMULATOR_ID" \
  -derivedDataPath .context/checkpoint-smoke-app CODE_SIGNING_ALLOWED=NO build
xcrun simctl install "$CHECKPOINT_SIMULATOR_ID" \
  .context/checkpoint-smoke-app/Build/Products/Debug-iphonesimulator/App.app
xcodebuild test -project .context/checkpoint-smoke-ios/CheckpointSmoke.xcodeproj \
  -scheme CheckpointSmoke -destination "platform=iOS Simulator,id=$CHECKPOINT_SIMULATOR_ID" \
  -derivedDataPath .context/checkpoint-smoke-runner \
  -resultBundlePath .context/checkpoint-smoke.xcresult CODE_SIGNING_ALLOWED=NO
xcrun xcresulttool export attachments --path .context/checkpoint-smoke.xcresult \
  --output-path .context/checkpoint-smoke-screenshots
```

The Xcode project is generated under `.context/`. The UI test launches the already-installed app by its bundle ID, `com.revenuecat.purchase_tester`. Choose `MODAL_FULL_SCREEN` in the manual tester to probe full-screen UIKit presentation; the default synthetic probe uses a sheet.

## Android

Requires JDK 21, the Android SDK and a running emulator/device. From the repository root:

```sh
example/purchase-tester/android/gradlew -p example/purchase-tester/android \
  -I "$PWD/example/purchase-tester/checkpoint-smoke/android-test.init.gradle" \
  :app:connectedDebugAndroidTest
adb pull /sdcard/Download/android-custom-dom-error-1.png .context/
adb pull /sdcard/Download/android-restored-webview.png .context/
```

The init script uses the isolated application ID `com.revenuecat.capacitor.checkpointspike`, adds UI Automator only to the smoke build, and includes the fixture Java source. Gradle may uninstall that isolated test application after the run. Screenshots in Downloads survive this cleanup. Test reports are in `example/purchase-tester/android/app/build/reports/androidTests/`.

## DOM lifecycle tests

```sh
npm --prefix example/purchase-tester run test.unit -- --run src/checkpointErrors.test.ts
```

# Example App - iOS Setup

This example app currently uses **Swift Package Manager (SPM)** by default.

## Swift Package Manager (SPM) - Current Setup

**To use SPM:**
1. Open `App.xcodeproj` directly in Xcode
2. Xcode will automatically resolve SPM packages
3. Build and run

No additional commands needed!

## CocoaPods

A `Podfile` is available if you want to use CocoaPods instead. Note that the project currently has SPM dependencies configured, so you would need to remove those first to avoid conflicts.

**To use CocoaPods:**
1. Remove SPM package dependencies from the project in Xcode
2. Run `pod install` in this directory
3. Open `App.xcworkspace` (NOT `App.xcodeproj`)
4. Build and run


# purchases-capacitor — Development Guidelines

This file provides guidance to AI coding agents when working with code in this repository.

## Project Overview

RevenueCat's official Capacitor SDK for in-app purchases and subscriptions. This plugin wraps the native iOS and Android SDKs, providing a unified TypeScript API for Capacitor/Ionic apps.

**Related repositories:**
- **iOS SDK**: https://github.com/RevenueCat/purchases-ios
- **Android SDK**: https://github.com/RevenueCat/purchases-android
- **Hybrid Common**: https://github.com/RevenueCat/purchases-hybrid-common — shared layer for hybrid SDKs

When implementing features or debugging, check these repos for reference and patterns.

## Important: Public API Stability

**Do NOT introduce breaking changes to the public API.** The SDK is used by many production apps.

**Safe changes:**
- Adding new optional parameters to existing methods
- Adding new classes, methods, or properties
- Bug fixes that don't change method signatures
- Internal implementation changes

**Requires explicit approval:**
- Removing or renaming public classes/methods/properties
- Changing method signatures (parameter types, required params)
- Changing return types
- Modifying behavior in ways that break existing integrations

## Code Structure

```
purchases-capacitor/
├── src/                          # TypeScript source (Web implementation)
│   ├── index.ts                  # Main entry point - registers Capacitor plugin
│   ├── definitions.ts            # Type definitions & interfaces
│   └── web.ts                    # Web fallback implementation
├── ios/                          # iOS native implementation (Swift)
│   └── Plugin/                   # Swift plugin code
│       └── PurchasesPlugin.swift # Main iOS implementation
├── android/                      # Android native implementation (Kotlin)
│   └── src/main/java/.../        # Kotlin plugin code
│       └── PurchasesPlugin.kt    # Main Android implementation
├── purchases-capacitor-ui/       # UI Components package (separate module)
├── example/purchase-tester/      # Example Ionic + React app
├── dist/                         # Compiled output (ESM + IIFE)
├── migrations/                   # Version migration guides
└── fastlane/                     # Release automation
```

## Common Development Commands

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Full verification (iOS + Android + Web)
npm run verify

# Verify platforms individually
npm run verify:ios      # pod install + xcodebuild
npm run verify:android  # ./gradlew clean build test
npm run verify:web      # npm run build

# Code quality
npm run lint            # ESLint + Prettier check
npm run fmt             # ESLint + Prettier autofix
npm run eslint          # ESLint only
npm run prettier        # Prettier for CSS, HTML, TS, JS, Java

# Generate API docs
npm run docgen

# Watch mode
npm run watch
```

### Platform-Specific Commands

```bash
# Android
cd android && ./gradlew clean build test

# iOS
cd ios && pod install && xcodebuild -workspace Plugin.xcworkspace -scheme Plugin
```

## Project Architecture

### TypeScript Layer
- **Entry Point**: `src/index.ts` — Registers `Purchases` plugin with Capacitor
- **Type Definitions**: `src/definitions.ts` — All public interfaces and types
- **Web Fallback**: `src/web.ts` — Mock implementations for web (not fully functional)

### Native Implementations
- **iOS**: Swift implementation in `ios/Plugin/PurchasesPlugin.swift`
  - Implements `CAPPlugin` + `PurchasesDelegate`
  - Delegates to `PurchasesHybridCommon` for core logic
- **Android**: Kotlin implementation in `android/.../PurchasesPlugin.kt`
  - Uses Kotlin coroutines for async operations
  - Delegates to `purchases-hybrid-common`

### Key Dependencies
- `@revenuecat/purchases-typescript-internal-esm` — Core SDK logic
- `PurchasesHybridCommon` (iOS/Android) — Native SDK bridge

## Constraints / Support Policy

| Platform | Minimum Version |
|----------|-----------------|
| Capacitor | 7.0.0 |
| iOS | 13.0+ |
| Android | API 23+ |

Don't raise minimum versions unless explicitly required and justified.

## Testing

```bash
# Run all verifications
npm run verify

# Lint and format
npm run lint
npm run fmt
```

## Development Workflow

1. Install dependencies: `npm install`
2. Install SwiftLint: `brew install swiftlint` (macOS)
3. Make changes in `src/` (TypeScript) or `ios/`/`android/` (native)
4. Run `npm run build` to compile
5. Run `npm run verify` to validate all platforms
6. Run `npm run lint` and `npm run fmt` before committing

## Pull Request Labels

When creating a pull request, **always add one of these labels** to categorize the change:

| Label | When to Use |
|-------|-------------|
| `pr:feat` | New user-facing features or enhancements |
| `pr:fix` | Bug fixes |
| `pr:other` | Internal changes, refactors, CI, docs, or anything that shouldn't trigger a release |

## When the Task is Ambiguous

1. Search for similar existing implementation in this repo first
2. Check purchases-ios, purchases-android, and purchases-hybrid-common for patterns
3. If there's a pattern, follow it exactly
4. If not, propose options with tradeoffs and pick the safest default

## Guardrails

- **Don't invent APIs or file paths** — verify they exist before referencing them
- **Don't remove code you don't understand** — ask for context first
- **Don't make large refactors** unless explicitly requested
- **Keep diffs minimal** — only touch what's necessary, preserve existing formatting
- **Don't break the public API** — if builds fail, investigate why
- **Check native SDKs** when unsure about cross-platform implementation details
- **Run lint and format** before committing (`npm run lint && npm run fmt`)
- **Never commit API keys or secrets** — do not stage or commit credentials or sensitive data

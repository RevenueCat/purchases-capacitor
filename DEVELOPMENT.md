# Development

## TODO: before merging 15.0-dev into main

Development integration checklist (SDK-4604):

- [ ] Replace temporary SPM branch references with the published PHC 21 version.
- [ ] Replace Apple PHC snapshot requirements and align Android, TypeScript, and web PHC dependencies with the released PHC 21 artifacts.
- [ ] Switch the Git-sourced CocoaPods CI default from `21.0-dev` to the same released PHC tag; keep the four-pod Git overrides and smoke coverage.
- [ ] Refresh dependency lockfiles and validate the final release version chain through core and UI integrations.

## Git-sourced CocoaPods CI

- `ios/CocoapodsInstallationTest/Podfile`
- `purchases-capacitor-ui/ios/CocoapodsInstallationTest/Podfile`
- `e2e-tests/CocoaPodsSmokeTest/ios/App/Podfile`

- [ ] TODO (SDK-4604): before merging `15.0-dev` into main, replace every PHC `21.0-dev` Git source above with the final release tag and restore the matching tag bump patterns. Keep native core/UI tags aligned with the PHC podspecs.

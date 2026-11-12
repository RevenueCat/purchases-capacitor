# Development

## TODO: before merging 15.0-dev into main

Development integration checklist (SDK-4604):

- [ ] Replace temporary SPM branch references with the published PHC 21 version.
- [ ] Replace Apple PHC snapshot requirements and align Android, TypeScript, and web PHC dependencies with the released PHC 21 artifacts.
- [ ] Switch the Git-sourced CocoaPods CI default from `21.0-dev` to the same released PHC tag; keep the four-pod Git overrides and smoke coverage.
- [ ] Refresh dependency lockfiles and validate the final release version chain through core and UI integrations.

1. Update versions in `VERSIONS.md`
1. Update to the latest purchases-hybrid-sdk version in `plugin.xml`
1. Update version in `package.json`, `plugin.xml`, `PurchasesPlugin.java`, and `CDVPurchasesPlugin.m`.
1. Run `npm run build`
1. Add an entry to CHANGELOG.md
1. `git commit -am "Preparing for version x.y.z"`
1. `git tag x.y.z`
1. `git push origin main && git push --tags`
1. Create a new release in github and upload
1. `npm publish`
1. Update the version in `package.json` and `plugin.xml` to x.y.z-SNAPSHOT, with x.y.z being the next version

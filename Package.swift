// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "RevenuecatPurchasesCapacitor",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "RevenuecatPurchasesCapacitor",
            targets: ["RevenuecatPurchasesCapacitor"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.0.0"),
        // TODO: before merging 15.0-dev into main, replace this development reference with the published PHC 21 version. (SDK-4604)
        .package(url: "https://github.com/RevenueCat/purchases-hybrid-common.git", branch: "21.0-dev")
    ],
    targets: [
        .target(
            name: "RevenuecatPurchasesCapacitor",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "PurchasesHybridCommon", package: "purchases-hybrid-common")
            ],
            path: "ios/Sources/RevenuecatPurchasesCapacitor"),
        .testTarget(
            name: "RevenuecatPurchasesCapacitorTests",
            dependencies: [
                "RevenuecatPurchasesCapacitor",
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "PurchasesHybridCommon", package: "purchases-hybrid-common")
            ],
            path: "ios/Tests/RevenuecatPurchasesCapacitorTests")
    ]
)

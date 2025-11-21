// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "RevenuecatPurchasesCapacitor",
    platforms: [
        .iOS(.v14)
    ],
    products: [
        .library(
            name: "RevenuecatPurchasesCapacitor",
            targets: ["RevenuecatPurchasesCapacitor"]
        ),
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "7.0.0"),
        .package(url: "https://github.com/RevenueCat/purchases-hybrid-common.git", from: "17.18.1"),
    ],
    targets: [
        .target(
            name: "RevenuecatPurchasesCapacitor",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "PurchasesHybridCommon", package: "purchases-hybrid-common"),
            ],
            path: "ios/Sources/RevenuecatPurchasesCapacitor/Plugin",
            exclude: ["PurchasesPlugin.m", "PurchasesPlugin.h", "Info.plist"]
        ),
    ]
)


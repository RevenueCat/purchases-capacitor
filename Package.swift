// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "purchases-capacitor",
    platforms: [
        .iOS(.v15)
    ],
    products: [
        .library(
            name: "RevenuecatPurchasesCapacitor",
            targets: ["RevenuecatPurchasesCapacitor"]
        ),
        .library(
            name: "RevenuecatPurchasesCapacitorUI",
            targets: ["RevenuecatPurchasesCapacitorUI"]
        ),
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm", from: "7.0.0"),
        .package(url: "https://github.com/RevenueCat/purchases-ios-spm", from: "5.0.0"),
        .package(url: "https://github.com/RevenueCat/purchases-hybrid-common", from: "17.17.0"),
    ],
    targets: [
        .target(
            name: "RevenuecatPurchasesCapacitor",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "RevenueCat", package: "purchases-ios-spm"),
                .product(name: "PurchasesHybridCommon", package: "purchases-hybrid-common"),
            ],
            path: "Sources/RevenuecatPurchasesCapacitor"
        ),
        .target(
            name: "RevenuecatPurchasesCapacitorUI",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "RevenueCat", package: "purchases-ios-spm"),
                .product(name: "RevenueCatUI", package: "purchases-ios-spm"),
                .product(name: "PurchasesHybridCommonUI", package: "purchases-hybrid-common"),
            ],
            path: "Sources/RevenuecatPurchasesCapacitorUI"
        ),
    ]
)

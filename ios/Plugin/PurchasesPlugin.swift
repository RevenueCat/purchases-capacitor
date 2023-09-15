// swiftlint:disable file_length type_body_length

import Foundation
import Capacitor
import PurchasesHybridCommon
import RevenueCat

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(PurchasesPlugin)
public class PurchasesPlugin: CAPPlugin, PurchasesDelegate {
    private let platformFlavor = "capacitor"
    private let platformVersion = "6.0.0"

    private let customerInfoKey = "customerInfo"

    private enum RefundRequestStatus: Int {
        case success = 0
        case userCancelled
        case error
    }

    // WIP: Need to handle concurrency for these...
    private var customerInfoUpdateListeners: [String] = []
    private var lastReceivedCustomerInfo: CustomerInfo?

    @objc func configure(_ call: CAPPluginCall) {
        guard let apiKey = call.getOrRejectString("apiKey") else { return }
        let appUserID = call.getString("appUserID")
        let observerMode = call.getBool("observerMode") ?? false
        let userDefaultsSuiteName = call.getString("userDefaultsSuiteName")
        let usesStoreKit2IfAvailable = call.getBool("usesStoreKit2IfAvailable") ?? false
        let purchases = Purchases.configure(apiKey: apiKey,
                                            appUserID: appUserID,
                                            observerMode: observerMode,
                                            userDefaultsSuiteName: userDefaultsSuiteName,
                                            platformFlavor: self.platformFlavor,
                                            platformFlavorVersion: self.platformVersion,
                                            dangerousSettings: DangerousSettings())
        purchases.delegate = self
        call.resolve()
    }

    @objc func setMockWebResults(_ call: CAPPluginCall) {
        NSLog("Cannot enable mock web results in iOS.")
        call.resolve()
    }

    @objc func setFinishTransactions(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        guard let finishTransactions = call.getOrRejectBool("finishTransactions") else { return }
        CommonFunctionality.setFinishTransactions(finishTransactions)
        call.resolve()
    }

    @objc func setSimulatesAskToBuyInSandbox(_ call: CAPPluginCall) {
        guard let simulatesAskToBuyInSandbox = call.getOrRejectBool("simulatesAskToBuyInSandbox") else { return }
        CommonFunctionality.simulatesAskToBuyInSandbox = simulatesAskToBuyInSandbox
        call.resolve()
    }

    @objc func addCustomerInfoUpdateListener(_ call: CAPPluginCall) {
        call.keepAlive = true
        self.customerInfoUpdateListeners.append(call.callbackId)
        if let lastReceivedCustomerInfo {
            call.resolve(CommonFunctionality.encode(customerInfo: lastReceivedCustomerInfo))
        }
    }

    @objc func removeCustomerInfoUpdateListener(_ call: CAPPluginCall) {
        guard let callbackId = call.getOrRejectString("listenerToRemove") else { return }

        var wasRemoved = false
        if let index = self.customerInfoUpdateListeners.firstIndex(of: callbackId) {
            self.customerInfoUpdateListeners.remove(at: index)
            self.bridge?.savedCall(withID: callbackId)?.keepAlive = false
            wasRemoved = true
        }
        call.resolve([
            "wasRemoved": wasRemoved
        ])
    }

    @objc func getOfferings(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        CommonFunctionality.getOfferings(completion: self.getCompletionBlockHandler(call))
    }

    @objc func getProducts(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        guard let productIds = call.getOrRejectStringArray("productIdentifiers") else { return }
        CommonFunctionality.getProductInfo(productIds) { products in
            call.resolve([
                "products": products
            ])
        }
    }

    @objc func purchaseStoreProduct(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        guard let storeProduct = call.getOrRejectObject("product") else { return }
        guard let productId = storeProduct["identifier"] as? String else {
            call.reject("Product parameter did not have identifier key")
            return
        }
        CommonFunctionality.purchase(product: productId,
                                     signedDiscountTimestamp: nil,
                                     completion: self.getCompletionBlockHandler(call))
    }

    @objc func purchaseDiscountedProduct(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        guard let storeProduct = call.getOrRejectObject("product") else { return }
        guard let productId = storeProduct["identifier"] as? String else {
            call.reject("Product parameter did not have identifier key")
            return
        }
        guard let discount = call.getOrRejectObject("discount") else { return }
        guard let signedDiscounTimestamp = discount["timestamp"] as? String else {
            call.reject("Discount parameter did not have timestamp key")
            return
        }
        CommonFunctionality.purchase(product: productId,
                                     signedDiscountTimestamp: signedDiscounTimestamp,
                                     completion: self.getCompletionBlockHandler(call))
    }

    @objc func purchasePackage(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        guard let package = call.getOrRejectObject("aPackage") else { return }
        guard let packageId = package["identifier"] as? String else {
            call.reject("aPackage parameter did not have identifier key")
            return
        }
        guard let offeringIdentifier = package["offeringIdentifier"] as? String else {
            call.reject("aPackage parameter did not have offeringIdentifier key")
            return
        }
        CommonFunctionality.purchase(package: packageId,
                                     offeringIdentifier: offeringIdentifier,
                                     signedDiscountTimestamp: nil,
                                     completion: self.getCompletionBlockHandler(call))
    }

    @objc func purchaseSubscriptionOption(_ call: CAPPluginCall) {
        self.rejectUnsupportedInIOS(call)
    }

    @objc func purchaseDiscountedPackage(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        guard let package = call.getOrRejectObject("aPackage") else { return }
        guard let packageId = package["identifier"] as? String else {
            call.reject("aPackage parameter did not have identifier key")
            return
        }
        guard let offeringIdentifier = package["offeringIdentifier"] as? String else {
            call.reject("aPackage parameter did not have offeringIdentifier key")
            return
        }
        guard let discount = call.getOrRejectObject("discount") else { return }
        guard let signedDiscounTimestamp = discount["timestamp"] as? String else {
            call.reject("Discount parameter did not have timestamp key")
            return
        }
        CommonFunctionality.purchase(package: packageId,
                                     offeringIdentifier: offeringIdentifier,
                                     signedDiscountTimestamp: signedDiscounTimestamp,
                                     completion: self.getCompletionBlockHandler(call))
    }

    @objc func restorePurchases(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        CommonFunctionality.restorePurchases(completion:
                                                self.getCompletionBlockHandler(call, wrapperKey: self.customerInfoKey))
    }

    @objc func getAppUserID(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        call.resolve([
            "appUserID": CommonFunctionality.appUserID
        ])
    }

    @objc func logIn(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        guard let appUserID = call.getOrRejectString("appUserID") else { return }
        CommonFunctionality.logIn(appUserID: appUserID, completion: self.getCompletionBlockHandler(call))
    }

    @objc func logOut(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        CommonFunctionality.logOut(completion: self.getCompletionBlockHandler(call, wrapperKey: self.customerInfoKey))
    }

    @objc func setLogLevel(_ call: CAPPluginCall) {
        guard let logLevel = call.getOrRejectString("level") else { return }
        CommonFunctionality.setLogLevel(logLevel)
        call.resolve()
    }

    @objc func setLogHandler(_ call: CAPPluginCall) {
        // WIP: Need to clear previous call if calling setLogHandler multiple times.
        call.keepAlive = true
        CommonFunctionality.setLogHander { log in
            call.resolve(log)
        }
    }

    @objc func getCustomerInfo(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        CommonFunctionality.customerInfo(completion: self.getCompletionBlockHandler(call,
                                                                                    wrapperKey: self.customerInfoKey))
    }

    @objc func syncPurchases(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        CommonFunctionality.syncPurchases(completion: self.getCompletionBlockHandler(call))
    }

    @objc func syncObserverModeAmazonPurchase(_ call: CAPPluginCall) {
        self.rejectUnsupportedInIOS(call)
    }

    @objc func enableAdServicesAttributionTokenCollection(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        if #available(iOS 14.3, *) {
            CommonFunctionality.enableAdServicesAttributionTokenCollection()
        }
        call.resolve()
    }

    @objc func isAnonymous(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        call.resolve([
            "isAnonymous": CommonFunctionality.isAnonymous
        ])
    }

    @objc func checkTrialOrIntroductoryPriceEligibility(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        guard let productIds = call.getOrRejectStringArray("productIdentifiers") else { return }

        CommonFunctionality.checkTrialOrIntroductoryPriceEligibility(for: productIds) { eligibilityResults in
            call.resolve(eligibilityResults)
        }
    }

    @objc func getPromotionalOffer(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        guard let storeProduct = call.getOrRejectObject("product") else { return }
        guard let productId = storeProduct["identifier"] as? String else {
            call.reject("Product parameter did not have identifier key")
            return
        }
        guard let discount = call.getOrRejectObject("discount") else { return }
        guard let discountIdentifier = discount["identifier"] as? String else {
            call.reject("Discount parameter did not have identifier key")
            return
        }

        CommonFunctionality.promotionalOffer(for: productId,
                                             discountIdentifier: discountIdentifier,
                                             completion: self.getCompletionBlockHandler(call))
    }

    @objc func invalidateCustomerInfoCache(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        CommonFunctionality.invalidateCustomerInfoCache()
        call.resolve()
    }

    @objc func presentCodeRedemptionSheet(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        if #available(iOS 14.0, *) {
            CommonFunctionality.presentCodeRedemptionSheet()
        }
        call.resolve()
    }

    @objc func setProxyURL(_ call: CAPPluginCall) {
        let url = call.getString("url")
        CommonFunctionality.proxyURLString = url
        call.resolve()
    }

    @objc func collectDeviceIdentifiers(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        CommonFunctionality.collectDeviceIdentifiers()
        call.resolve()
    }

    @objc func canMakePayments(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        let features = call.getArray("features", []) as? [Int] ?? []
        let canMakePayments = CommonFunctionality.canMakePaymentsWithFeatures(features)
        call.resolve([
            "canMakePayments": canMakePayments
        ])
    }

    @objc func beginRefundRequestForActiveEntitlement(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        if #available(iOS 15.0, *) {
            CommonFunctionality.beginRefundRequestForActiveEntitlement(completion:
                                                                        self.getBeginRefundRequestCompletion(call))
        } else {
            call.unavailable()
        }
    }

    @objc func beginRefundRequestForEntitlement(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        guard let entitlementInfo = call.getOrRejectObject("entitlementInfo") else { return }
        guard let entitlementId = entitlementInfo["identifier"] as? String else {
            call.reject("entitlementInfo parameter did not have identifier field")
            return
        }

        if #available(iOS 15.0, *) {
            CommonFunctionality.beginRefundRequest(entitlementId: entitlementId,
                                                   completion: self.getBeginRefundRequestCompletion(call))
        } else {
            call.unavailable()
        }
    }

    @objc func beginRefundRequestForProduct(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        guard let storeProduct = call.getOrRejectObject("storeProduct") else { return }
        guard let productId = storeProduct["identifier"] as? String else {
            call.reject("storeProduct parameter did not have identifier field")
            return
        }

        if #available(iOS 15.0, *) {
            CommonFunctionality.beginRefundRequest(productId: productId,
                                                   completion: self.getBeginRefundRequestCompletion(call))
        } else {
            call.unavailable()
        }
    }

    @objc func isConfigured(_ call: CAPPluginCall) {
        call.resolve([
            "isConfigured": Purchases.isConfigured
        ])
    }

    public func purchases(_ purchases: Purchases, receivedUpdated customerInfo: CustomerInfo) {
        self.customerInfoUpdateListeners.forEach { [weak self] callbackId in
            self?.bridge?.savedCall(withID: callbackId)?.resolve(CommonFunctionality.encode(customerInfo: customerInfo))
        }
        self.lastReceivedCustomerInfo = customerInfo
    }
}

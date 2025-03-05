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
    private let platformVersion = "10.2.0"

    private let customerInfoKey = "customerInfo"
    private let transactionKey = "transaction"

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
        var storeKitVersion = call.getString("storeKitVersion") ?? StoreKitVersion.default.name
        let purchasesAreCompletedByString = call.getString("purchasesAreCompletedBy")
        var purchasesAreCompletedBy: String? = nil
        if purchasesAreCompletedByString == PurchasesAreCompletedBy.revenueCat.name {
            purchasesAreCompletedBy = PurchasesAreCompletedBy.revenueCat.name
        } else {
            if let purchasesAreCompletedByObject = call.getObject("purchasesAreCompletedBy") {
                purchasesAreCompletedBy = purchasesAreCompletedByObject["type"] as? String
                if let newStoreKitVersion = purchasesAreCompletedByObject["storeKitVersion"] as? String,
                   newStoreKitVersion != storeKitVersion {
                    NSLog("""
                          [PurchasesCapacitor] Warning: storeKitVersion in purchasesAreCompletedBy object is
                          different from storeKitVersion in configure call. Using storeKitVersion from
                          purchasesAreCompletedBy object.
                          """)
                    storeKitVersion = newStoreKitVersion
                }
            }
        }
        let userDefaultsSuiteName = call.getString("userDefaultsSuiteName")
        let shouldShowInAppMessagesAutomatically = call.getBool("shouldShowInAppMessagesAutomatically") ?? true
        let entitlementVerificationMode = call.getString("entitlementVerificationMode")
        let diagnosticsEnabled = call.getBool("diagnosticsEnabled") ?? false

        let purchases = Purchases.configure(apiKey: apiKey,
                                            appUserID: appUserID,
                                            purchasesAreCompletedBy: purchasesAreCompletedBy,
                                            userDefaultsSuiteName: userDefaultsSuiteName,
                                            platformFlavor: self.platformFlavor,
                                            platformFlavorVersion: self.platformVersion,
                                            storeKitVersion: storeKitVersion,
                                            dangerousSettings: DangerousSettings(),
                                            shouldShowInAppMessagesAutomatically: shouldShowInAppMessagesAutomatically,
                                            verificationMode: entitlementVerificationMode,
                                            diagnosticsEnabled: diagnosticsEnabled)
        purchases.delegate = self
        call.resolve()
    }

    @objc func parseAsWebPurchaseRedemption(_ call: CAPPluginCall) {
        guard let urlString = call.getOrRejectString("urlString") else { return }
        let result: [String: Any?]
        if CommonFunctionality.isWebPurchaseRedemptionURL(urlString: urlString) {
            result = ["webPurchaseRedemption": ["redemptionLink": urlString]]
        } else {
            result = [
                "webPurchaseRedemption": nil
            ]
        }
        call.resolve(result as PluginCallResultData)
    }

    @objc func redeemWebPurchase(_ call: CAPPluginCall) {
        guard let webPurchaseRedemption = call.getOrRejectObject("webPurchaseRedemption") else { return }
        guard let redemptionLink = webPurchaseRedemption["redemptionLink"] as? String else {
            call.reject("WebPurchaseRedemption parameter did not have a redemptionLink key")
            return
        }
        CommonFunctionality.redeemWebPurchase(urlString: redemptionLink,
                                              completion: self.getCompletionBlockHandler(call))
    }

    @objc func setMockWebResults(_ call: CAPPluginCall) {
        NSLog("Cannot enable mock web results in iOS.")
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

    @objc func getCurrentOfferingForPlacement(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        guard let placementIdentifier = call.getOrRejectString("placementIdentifier") else { return }
        CommonFunctionality.getCurrentOffering(forPlacement: placementIdentifier, completion: self.getCompletionBlockHandler(call))
    }

    @objc func syncAttributesAndOfferingsIfNeeded(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        CommonFunctionality.syncAttributesAndOfferingsIfNeeded(completion: self.getCompletionBlockHandler(call))
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
        guard let signedDiscountTimestamp = discount["timestamp"] as? Int else {
            call.reject("Discount parameter did not have timestamp key")
            return
        }
        CommonFunctionality.purchase(product: productId,
                                     signedDiscountTimestamp: String(signedDiscountTimestamp),
                                     completion: self.getCompletionBlockHandler(call))
    }

    @objc func purchasePackage(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        guard let package = call.getOrRejectObject("aPackage") else { return }
        guard let packageId = package["identifier"] as? String else {
            call.reject("aPackage parameter did not have identifier key")
            return
        }
        guard let presentedOfferingContext = package["presentedOfferingContext"] as? [String: Any] else {
            call.reject("aPackage parameter did not have presentedOfferingContext key")
            return
        }
        CommonFunctionality.purchase(package: packageId,
                                     presentedOfferingContext: presentedOfferingContext,
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
        guard let presentedOfferingContext = package["presentedOfferingContext"] as? [String: Any] else {
            call.reject("aPackage parameter did not have presentedOfferingContext key")
            return
        }
        guard let discount = call.getOrRejectObject("discount") else { return }
        guard let signedDiscountTimestamp = discount["timestamp"] as? Int else {
            call.reject("Discount parameter did not have timestamp key")
            return
        }
        CommonFunctionality.purchase(package: packageId,
                                     presentedOfferingContext: presentedOfferingContext,
                                     signedDiscountTimestamp: String(signedDiscountTimestamp),
                                     completion: self.getCompletionBlockHandler(call))
    }

    @objc func restorePurchases(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        CommonFunctionality.restorePurchases(completion:
                                                self.getCompletionBlockHandler(call, wrapperKey: self.customerInfoKey))
    }

    @objc func recordPurchase(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        guard let productID = call.getOrRejectString("productID") else { return }
        if #available(iOS 15.0, macOS 12.0, tvOS 15.0, watchOS 8.0, *) {
            CommonFunctionality.recordPurchase(productID: productID,
                                               completion: self.getCompletionBlockHandler(call,
                                                                                          wrapperKey: self.transactionKey))
        } else {
            NSLog("[Purchases] Warning: tried to record purchase, but it's only available on iOS 15.0+")
            call.unavailable()
        }
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

    @objc func syncAmazonPurchase(_ call: CAPPluginCall) {
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

    @objc func getEligibleWinBackOffersForProduct(_ call: CAPPluginCall) {
        guard #available(iOS 18.0, macOS 15.0, tvOS 18.0, watchOS 11.0, visionOS 2.0, *) else {
            NSLog("[Purchases] Warning: iOS win-back offers are only available on iOS 18.0+")
            call.unavailable()
            return
        }

        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        guard let product = call.getOrRejectObject("product"),
              let productID = product["identifier"] as? String else {
            call.reject("Product does not contain an identifier.")
            return
        }
       
        CommonFunctionality.eligibleWinBackOffers(
            for: productID,
            completion: self.getCompletionBlockHandlerForArrayResponse(
                call,
                wrapperKey: "eligibleWinBackOffers"
            )
        )
    }

    @objc func getEligibleWinBackOffersForPackage(_ call: CAPPluginCall) {
        guard #available(iOS 18.0, macOS 15.0, tvOS 18.0, watchOS 11.0, visionOS 2.0, *) else {
            NSLog("[Purchases] Warning: iOS win-back offers are only available on iOS 18.0+")
            call.unavailable()
            return
        }

        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        guard let aPackage = call.getOrRejectObject("aPackage"),
              let product = aPackage["product"] as? [String: Any],
              let productID = product["identifier"] as? String else {
            call.reject("Package did not contain a product with a product identifier.")
            return
        }
       
        CommonFunctionality.eligibleWinBackOffers(
            for: productID,
            completion: self.getCompletionBlockHandlerForArrayResponse(
                call,
                wrapperKey: "eligibleWinBackOffers"
            )
        )
    }

    @objc func purchaseProductWithWinBackOffer(_ call: CAPPluginCall) {
        guard #available(iOS 18.0, macOS 15.0, tvOS 18.0, watchOS 11.0, visionOS 2.0, *) else {
            NSLog("[Purchases] Warning: iOS win-back offers are only available on iOS 18.0+")
            call.unavailable()
            return
        }

        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        guard let product = call.getOrRejectObject("product") else { return }
        guard let productID = product["identifier"] as? String else {
            call.reject("Product does not contain an identifier.")
            return
        }

        guard let winBackOffer = call.getOrRejectObject("winBackOffer") else { return }
        guard let winBackOfferID = winBackOffer["identifier"] as? String else {
            call.reject("Win-back offer does not contain an identifier.")
            return
        }

        CommonFunctionality.purchase(
            product: productID,
            winBackOfferID: winBackOfferID,
            completion: self.getCompletionBlockHandler(call)
        )
    }

    @objc func purchasePackageWithWinBackOffer(_ call: CAPPluginCall) {
        guard #available(iOS 18.0, macOS 15.0, tvOS 18.0, watchOS 11.0, visionOS 2.0, *) else {
            NSLog("[Purchases] Warning: iOS win-back offers are only available on iOS 18.0+")
            call.unavailable()
            return
        }

        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        guard let aPackage = call.getOrRejectObject("aPackage") else { return }
        guard let packageID = aPackage["identifier"] as? String else {
            call.reject("Package does not contain an identifier.")
            return
        }

        guard let winBackOffer = call.getOrRejectObject("winBackOffer") else { return }
        guard let winBackOfferID = winBackOffer["identifier"] as? String else {
            call.reject("Win-back offer does not contain an identifier.")
            return
        }

        guard let presentedOfferingContext = aPackage["presentedOfferingContext"] as? [String: Any] else {
            call.reject("aPackage parameter did not have presentedOfferingContext key")
            return
        }

        CommonFunctionality.purchase(
            package: packageID,
            presentedOfferingContext: presentedOfferingContext,
            winBackOfferID: winBackOfferID,
            completion: self.getCompletionBlockHandler(call)
        )
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

    @objc func showInAppMessages(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        let intMessageTypes = call.getArray("messageTypes") as? [Int]
        #if os(iOS) || targetEnvironment(macCatalyst) || VISION_OS
        if #available(iOS 16.0, *) {
            if let intMessageTypes {
                let messageTypes = intMessageTypes.map({ intNumber in
                    NSNumber(integerLiteral: intNumber)
                })
                CommonFunctionality.showStoreMessages(forRawValues: Set(messageTypes)) {
                    call.resolve()
                }
            } else {
                CommonFunctionality.showStoreMessages {
                    call.resolve()
                }
            }
        } else {
            NSLog("[Purchases] Warning: tried to show in app messages, but it's only available on iOS 16.0+")
            call.resolve()
        }
        #else
        NSLog("[Purchases] Warning: tried to show in app messages, but it's only available on iOS or macCatalyst")
        call.resolve()
        #endif
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

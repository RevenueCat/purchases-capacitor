import Foundation
import Capacitor
import PurchasesHybridCommonUI
import RevenueCatUI

/**
 * RevenueCat UI Plugin for Capacitor
 * Based on the official RevenueCat Flutter UI SDK approach
 */
@objc(RevenueCatUIPlugin)
public class RevenueCatUIPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "RevenueCatUIPlugin"
    public let jsName = "RevenueCatUI"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "presentPaywall", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "presentPaywallIfNeeded", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "presentCustomerCenter", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "resumePurchaseInitiated", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "resumePurchaseLogicPurchase", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "resumePurchaseLogicRestore", returnType: CAPPluginReturnPromise),
    ]

    // MARK: - Properties

    /// PaywallProxy for iOS 15.0+, will be nil on older iOS versions
    private var _paywallProxy: PaywallProxyType?

    /// CustomerCenterProxy for iOS 15.0+, will be nil on older iOS versions
    private var _customerCenterProxy: CustomerCenterProxyType?

    /// Delegate adapter retained strongly since PaywallProxy.delegate is weak
    private var _delegateAdapter: AnyObject?

    // MARK: - Initialization

    override init() {
        super.init()

        // Initialize proxies if iOS 15.0+ is available
        if #available(iOS 15.0, *) {
            let proxy = PaywallProxy()
            let adapter = PaywallDelegateAdapter()
            adapter.plugin = self
            proxy.delegate = adapter
            _paywallProxy = proxy
            _delegateAdapter = adapter
            _customerCenterProxy = CustomerCenterProxy()
        }
    }

    // MARK: - Plugin Methods

    @objc func presentPaywall(_ call: CAPPluginCall) {
        // Ensure UI operations run on the main thread
        DispatchQueue.main.async { [weak self] in
            guard let self = self else {
                call.reject("Plugin instance was deallocated", "PAYWALL_ERROR")
                return
            }

            guard #available(iOS 15.0, *), let proxy = self._paywallProxy else {
                call.reject("PaywallViewController requires iOS 15.0 or newer", "PAYWALL_ERROR")
                return
            }

            let offeringOptions = self.processOfferingOptions(call)
            let displayCloseButton = call.getBool("displayCloseButton") ?? false
            let hasPurchaseLogic = call.getBool("hasPurchaseLogic") ?? false

            var options: [String: Any] = [
                "displayCloseButton": displayCloseButton,
                "shouldBlockTouchEvents": true
            ]

            if let offeringOptions = offeringOptions {
                options.merge(offeringOptions) { _, offeringOption in
                    offeringOption
                }
            }

            let bridge = hasPurchaseLogic ? self.createPurchaseLogicBridge() : nil

            let resultHandler: (String) -> Void = { result in
                DispatchQueue.main.async {
                    call.resolve(["result": result])
                }
            }

            proxy.presentPaywall(
                options: options,
                purchaseLogicBridge: bridge,
                paywallResultHandler: resultHandler
            )
        }
    }

    @objc func presentPaywallIfNeeded(_ call: CAPPluginCall) {
        // Ensure UI operations run on the main thread
        DispatchQueue.main.async { [weak self] in
            guard let self = self else {
                call.reject("Plugin instance was deallocated", "PAYWALL_ERROR")
                return
            }

            guard #available(iOS 15.0, *), let proxy = self._paywallProxy else {
                call.reject("PaywallViewController requires iOS 15.0 or newer", "PAYWALL_ERROR")
                return
            }

            guard let requiredEntitlementIdentifier = call.getString("requiredEntitlementIdentifier") else {
                call.reject("Required entitlement identifier is missing", "PAYWALL_ERROR")
                return
            }

            let offeringOptions = self.processOfferingOptions(call)
            let displayCloseButton = call.getBool("displayCloseButton") ?? false
            let hasPurchaseLogic = call.getBool("hasPurchaseLogic") ?? false

            var options: [String: Any] = [
                "displayCloseButton": displayCloseButton,
                "shouldBlockTouchEvents": true,
                "requiredEntitlementIdentifier": requiredEntitlementIdentifier
            ]

            if let offeringOptions = offeringOptions {
                options.merge(offeringOptions) { _, offeringOption in
                    offeringOption
                }
            }

            let bridge = hasPurchaseLogic ? self.createPurchaseLogicBridge() : nil

            let resultHandler: (String) -> Void = { result in
                DispatchQueue.main.async {
                    call.resolve(["result": result])
                }
            }

            proxy.presentPaywallIfNeeded(
                options: options,
                purchaseLogicBridge: bridge,
                paywallResultHandler: resultHandler
            )
        }
    }

    @objc func presentCustomerCenter(_ call: CAPPluginCall) {
        // Ensure UI operations run on the main thread
        DispatchQueue.main.async { [weak self] in
            guard let self = self else {
                call.reject("Plugin instance was deallocated", "CUSTOMER_CENTER_ERROR")
                return
            }

            guard #available(iOS 15.0, *), let proxy = self._customerCenterProxy else {
                call.reject("CustomerCenterViewController requires iOS 15.0 or newer", "CUSTOMER_CENTER_ERROR")
                return
            }

            proxy.present(resultHandler: { [weak self] in
                guard self != nil else { return }
                DispatchQueue.main.async {
                    call.resolve()
                }
            })
        }
    }

    @objc func resumePurchaseInitiated(_ call: CAPPluginCall) {
        guard let requestId = call.getString("requestId") else {
            call.reject("Missing requestId", "PAYWALL_ERROR")
            return
        }
        let shouldProceed = call.getBool("shouldProceed") ?? true
        if #available(iOS 15.0, *) {
            PaywallProxy.resumePurchasePackageInitiated(requestId: requestId, shouldProceed: shouldProceed)
        }
        call.resolve()
    }

    @objc func resumePurchaseLogicPurchase(_ call: CAPPluginCall) {
        guard let requestId = call.getString("requestId") else {
            call.reject("Missing requestId", "PAYWALL_ERROR")
            return
        }
        let resultStr = call.getString("result") ?? HybridPurchaseLogicBridge.resultError
        let errorMessage = (call.getObject("error") as? [String: Any])?["message"] as? String
        if #available(iOS 15.0, *) {
            HybridPurchaseLogicBridge.resolveResult(
                requestId: requestId,
                resultString: resultStr,
                errorMessage: errorMessage
            )
        }
        call.resolve()
    }

    @objc func resumePurchaseLogicRestore(_ call: CAPPluginCall) {
        guard let requestId = call.getString("requestId") else {
            call.reject("Missing requestId", "PAYWALL_ERROR")
            return
        }
        let resultStr = call.getString("result") ?? HybridPurchaseLogicBridge.resultError
        let errorMessage = (call.getObject("error") as? [String: Any])?["message"] as? String
        if #available(iOS 15.0, *) {
            HybridPurchaseLogicBridge.resolveResult(
                requestId: requestId,
                resultString: resultStr,
                errorMessage: errorMessage
            )
        }
        call.resolve()
    }
}

// MARK: - Delegate Adapter

@available(iOS 15.0, *)
private class PaywallDelegateAdapter: NSObject, PaywallViewControllerDelegateWrapper {
    weak var plugin: RevenueCatUIPlugin?

    func paywallViewController(_ controller: PaywallViewController,
                                didStartPurchaseWith packageDictionary: [String: Any]) {
        plugin?.notifyListeners("onPurchaseStarted", data: ["packageBeingPurchased": packageDictionary])
    }

    func paywallViewController(_ controller: PaywallViewController,
                                didFinishPurchasingWith customerInfoDictionary: [String: Any],
                                transaction transactionDictionary: [String: Any]?) {
        var data: [String: Any] = ["customerInfo": customerInfoDictionary]
        if let transactionDictionary = transactionDictionary {
            data["storeTransaction"] = transactionDictionary
        }
        plugin?.notifyListeners("onPurchaseCompleted", data: data)
    }

    func paywallViewController(_ controller: PaywallViewController,
                                didFailPurchasingWith errorDictionary: [String: Any]) {
        plugin?.notifyListeners("onPurchaseError", data: ["error": errorDictionary])
    }

    func paywallViewControllerDidCancelPurchase(_ controller: PaywallViewController) {
        plugin?.notifyListeners("onPurchaseCancelled", data: [:])
    }

    func paywallViewControllerDidStartRestore(_ controller: PaywallViewController) {
        plugin?.notifyListeners("onRestoreStarted", data: [:])
    }

    func paywallViewController(_ controller: PaywallViewController,
                                didFinishRestoringWith customerInfoDictionary: [String: Any]) {
        plugin?.notifyListeners("onRestoreCompleted", data: ["customerInfo": customerInfoDictionary])
    }

    func paywallViewController(_ controller: PaywallViewController,
                                didFailRestoringWith errorDictionary: [String: Any]) {
        plugin?.notifyListeners("onRestoreError", data: ["error": errorDictionary])
    }

    func paywallViewControllerWasDismissed(_ controller: PaywallViewController) {
        plugin?.notifyListeners("paywallDismissed", data: [:])
    }

    func paywallViewController(_ controller: PaywallViewController,
                                didInitiatePurchaseWith packageDictionary: [String: Any],
                                requestId: String) {
        if plugin?.hasListeners("onPurchaseInitiated") == true {
            plugin?.notifyListeners("onPurchaseInitiated", data: [
                "package": packageDictionary,
                "requestId": requestId
            ])
        } else {
            // No JS listeners registered — auto-resume to avoid hanging the purchase flow.
            PaywallProxy.resumePurchasePackageInitiated(requestId: requestId, shouldProceed: true)
        }
    }

}

// MARK: - PurchaseLogic Bridge

@available(iOS 15.0, *)
private extension RevenueCatUIPlugin {

    func createPurchaseLogicBridge() -> HybridPurchaseLogicBridge {
        return HybridPurchaseLogicBridge(
            onPerformPurchase: { [weak self] eventData in
                self?.notifyListeners("onPerformPurchaseRequest", data: eventData)
            },
            onPerformRestore: { [weak self] eventData in
                self?.notifyListeners("onPerformRestoreRequest", data: eventData)
            }
        )
    }
}

// MARK: - Offering Options Processing

@available(iOS 15.0, *)
private extension RevenueCatUIPlugin {

    func processOfferingOptions(_ call: CAPPluginCall) -> [String: Any]? {
        let offering = call.getObject("offering")
        let offeringIdentifier = offering?["identifier"] as? String
        let availablePackages = offering?["availablePackages"] as? JSArray
        let firstPackage = availablePackages?.first as? JSObject
        let presentedOfferingContext = firstPackage?["presentedOfferingContext"] as? JSObject
        let contextOfferingIdentifier = presentedOfferingContext?["offeringIdentifier"]
        let contextPlacementIdentifier = presentedOfferingContext?["placementIdentifier"]
        let contextTargetingContext = presentedOfferingContext?["targetingContext"] as? JSObject
        let contextTargetingRevision = contextTargetingContext?["revision"]
        let contextTargetingRuleId = contextTargetingContext?["ruleId"]

        var options: [String: Any] = [:]
        if let offeringIdentifier = offeringIdentifier {
            options[PaywallProxy.PaywallOptionsKeys.offeringIdentifier] = offeringIdentifier
            if let presentedOfferingContext = presentedOfferingContext,
                let contextOfferingIdentifier = contextOfferingIdentifier {
                var presentedOfferingContextMap = [
                    PaywallProxy.PresentedOfferingContextKeys.offeringIdentifier: contextOfferingIdentifier,
                    PaywallProxy.PresentedOfferingContextKeys.placementIdentifier: contextPlacementIdentifier,
                ]
                if let contextTargetingRevision = contextTargetingRevision,
                    let contextTargetingRuleId {
                    presentedOfferingContextMap[PaywallProxy.PresentedOfferingContextKeys.targetingContext] = [
                        PaywallProxy.PresentedOfferingTargetingContextKeys.revision: contextTargetingRevision,
                        PaywallProxy.PresentedOfferingTargetingContextKeys.ruleId: contextTargetingRuleId
                    ]
                }
                options[PaywallProxy.PaywallOptionsKeys.presentedOfferingContext] = presentedOfferingContextMap
            }
            return options
        } else {
            return nil
        }
    }
}

// MARK: - Type Aliases to avoid direct type references

/// Type alias for PaywallProxy to avoid direct reference to the concrete type
private protocol PaywallProxyType: AnyObject {
    func presentPaywall(options: [String: Any], purchaseLogicBridge: HybridPurchaseLogicBridge?, paywallResultHandler: @escaping (String) -> Void)
    func presentPaywallIfNeeded(options: [String: Any], purchaseLogicBridge: HybridPurchaseLogicBridge?, paywallResultHandler: @escaping (String) -> Void)
}

/// Type alias for CustomerCenterProxy to avoid direct reference to the concrete type
private protocol CustomerCenterProxyType: AnyObject {
    func present(resultHandler: @escaping () -> Void)
}

// MARK: - Proxy Conformances

@available(iOS 15.0, *)
extension PaywallProxy: PaywallProxyType {}

@available(iOS 15.0, *)
extension CustomerCenterProxy: CustomerCenterProxyType {}

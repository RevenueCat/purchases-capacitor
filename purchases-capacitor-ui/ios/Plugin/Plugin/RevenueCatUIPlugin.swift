import Foundation
import Capacitor
import PurchasesHybridCommonUI

/**
 * RevenueCat UI Plugin for Capacitor
 * Based on the official RevenueCat Flutter UI SDK approach
 */
@objc(RevenueCatUIPlugin)
public class RevenueCatUIPlugin: CAPPlugin {

    // MARK: - Properties

    /// PaywallProxy for iOS 15.0+, will be nil on older iOS versions
    private var _paywallProxy: PaywallProxyType?

    /// CustomerCenterProxy for iOS 15.0+, will be nil on older iOS versions
    private var _customerCenterProxy: CustomerCenterProxyType?

    // MARK: - Initialization

    override init() {
        super.init()

        // Initialize proxies if iOS 15.0+ is available
        if #available(iOS 15.0, *) {
            _paywallProxy = PaywallProxy()
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

            var options: [String: Any] = [
                "displayCloseButton": displayCloseButton,
                "shouldBlockTouchEvents": true
            ]

            if let offeringOptions = offeringOptions {
                options.merge(offeringOptions) { original, offeringOption in
                    offeringOption
                }
            }

            proxy.presentPaywall(
                options: options,
                paywallResultHandler: { [weak self] result in
                    guard let self = self else { return }

                    DispatchQueue.main.async {
                        call.resolve(["result": result])
                    }
                }
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

            var options: [String: Any] = [
                "displayCloseButton": displayCloseButton,
                "shouldBlockTouchEvents": true,
                "requiredEntitlementIdentifier": requiredEntitlementIdentifier
            ]

            if let offeringOptions = offeringOptions {
                options.merge(offeringOptions) { original, offeringOption in
                    offeringOption
                }
            }

            proxy.presentPaywallIfNeeded(
                options: options,
                paywallResultHandler: { [weak self] result in
                    guard let self = self else { return }

                    DispatchQueue.main.async {
                        call.resolve(["result": result])
                    }
                }
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
                guard let self = self else { return }

                DispatchQueue.main.async {
                    call.resolve()
                }
            })
        }
    }
}

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
        let displayCloseButton = call.getBool("displayCloseButton") ?? false

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
    func presentPaywall(options: [String: Any], paywallResultHandler: @escaping (String) -> Void)
    func presentPaywallIfNeeded(options: [String: Any], paywallResultHandler: @escaping (String) -> Void)
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

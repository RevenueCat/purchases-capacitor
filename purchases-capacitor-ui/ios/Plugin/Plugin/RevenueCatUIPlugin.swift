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

    private var savedCall: CAPPluginCall?

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
                call.reject("Plugin instance was deallocated")
                return 
            }
            
            // Check if there's already a presentation in progress
            if self.savedCall != nil {
                call.reject("A paywall presentation is already in progress")
                return
            }
            
            guard #available(iOS 15.0, *), let proxy = self._paywallProxy else {
                call.reject("PaywallViewController requires iOS 15.0 or newer")
                return
            }

            self.savedCall = call

            let offeringIdentifier = call.getString("offeringIdentifier")
            let displayCloseButton = call.getBool("displayCloseButton") ?? false

            var options: [String: Any] = [
                "displayCloseButton": displayCloseButton,
                "shouldBlockTouchEvents": true
            ]

            if let offeringIdentifier = offeringIdentifier {
                options["offeringIdentifier"] = offeringIdentifier
            }

            proxy.presentPaywall(
                options: options,
                paywallResultHandler: { [weak self] result in
                    guard let self = self else { return }
                    
                    DispatchQueue.main.async {
                        if let call = self.savedCall {
                            call.resolve(["result": result])
                            self.savedCall = nil
                        }
                    }
                }
            )
        }
    }

    @objc func presentPaywallIfNeeded(_ call: CAPPluginCall) {
        // Ensure UI operations run on the main thread
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { 
                call.reject("Plugin instance was deallocated")
                return 
            }
            
            // Check if there's already a presentation in progress
            if self.savedCall != nil {
                call.reject("A paywall presentation is already in progress")
                return
            }
            
            guard #available(iOS 15.0, *), let proxy = self._paywallProxy else {
                call.reject("PaywallViewController requires iOS 15.0 or newer")
                return
            }

            self.savedCall = call

            guard let requiredEntitlementIdentifier = call.getString("requiredEntitlementIdentifier") else {
                call.reject("Required entitlement identifier is missing")
                return
            }

            let offeringIdentifier = call.getString("offeringIdentifier")
            let displayCloseButton = call.getBool("displayCloseButton") ?? false

            var options: [String: Any] = [
                "displayCloseButton": displayCloseButton,
                "shouldBlockTouchEvents": true,
                "requiredEntitlementIdentifier": requiredEntitlementIdentifier
            ]

            if let offeringIdentifier = offeringIdentifier {
                options["offeringIdentifier"] = offeringIdentifier
            }

            proxy.presentPaywallIfNeeded(
                options: options,
                paywallResultHandler: { [weak self] result in
                    guard let self = self else { return }
                    
                    DispatchQueue.main.async {
                        if let call = self.savedCall {
                            call.resolve(["result": result])
                            self.savedCall = nil
                        }
                    }
                }
            )
        }
    }

    @objc func presentCustomerCenter(_ call: CAPPluginCall) {
        // Ensure UI operations run on the main thread
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { 
                call.reject("Plugin instance was deallocated")
                return 
            }
            
            // Check if there's already a presentation in progress
            if self.savedCall != nil {
                call.reject("A customer center presentation is already in progress")
                return
            }
            
            guard #available(iOS 15.0, *), let proxy = self._customerCenterProxy else {
                call.reject("CustomerCenterViewController requires iOS 15.0 or newer")
                return
            }

            self.savedCall = call

            proxy.present(resultHandler: { [weak self] in
                guard let self = self else { return }
                
                DispatchQueue.main.async {
                    if let call = self.savedCall {
                        call.resolve()
                        self.savedCall = nil
                    }
                }
            })
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

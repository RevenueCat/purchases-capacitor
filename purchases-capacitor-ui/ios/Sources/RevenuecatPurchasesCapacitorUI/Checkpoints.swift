import Foundation
import Capacitor
import PurchasesHybridCommon
@_spi(Internal) import RevenueCat
@_spi(InviteOnlyCheckpointsApi) import RevenueCatUI

extension RevenueCatUIPlugin {
    @objc func checkpoint(_ call: CAPPluginCall) {
        DispatchQueue.main.async { [weak self] in
            guard let self else {
                call.reject("Plugin instance was deallocated", "CHECKPOINT_ERROR")
                return
            }
            guard #available(iOS 15.0, *) else {
                call.reject("Checkpoints require iOS 15 or later", "UNSUPPORTED_OS_VERSION")
                return
            }
            guard let identifier = call.getString("identifier"),
                  let callId = call.getString("callId") else {
                call.reject("Missing checkpoint identifier or callId", "BAD_ARGS")
                return
            }
            guard Purchases.isConfigured else {
                call.reject("Configure Purchases before calling a checkpoint", "NOT_CONFIGURED")
                return
            }
            let variables = (call.getObject("customVariables") ?? [:]).compactMapValues { value -> CustomVariableValue? in
                if let number = value as? NSNumber {
                    return CFGetTypeID(number) == CFBooleanGetTypeID()
                        ? .bool(number.boolValue) : .number(number.doubleValue)
                }
                if let string = value as? String { return .string(string) }
                return nil
            }
            let mode: FlowPresentationMode
            switch call.getString("presentationMode") {
            case "MODAL_FULL_SCREEN": mode = .modalFullScreen
            case "MODAL_SHEET": mode = .modalSheet
            default: mode = .default
            }
            // Resolve setup separately: backing out or a blocking failure never calls onPassed.
            call.resolve()
            Purchases.shared.checkpoint(identifier, customVariables: variables, presentationMode: mode) { [weak self] result in
                let customer = result.customer.dictionary
                let entitlements = (customer["entitlements"] as? [String: Any])?["all"] as? [String: Any] ?? [:]
                let flow: Any = result.flow.map { flow -> [String: Any] in
                    [
                        "obtainedEntitlements": flow.obtainedEntitlements.sorted {
                            $0.entitlementInfo.identifier < $1.entitlementInfo.identifier
                        }.map { ["entitlementInfo": entitlements[$0.entitlementInfo.identifier] ?? NSNull()] },
                        "obtainedProducts": flow.obtainedProducts.sorted { $0.product.id < $1.product.id }.map {
                            // PHC exposes its original StoreProduct serializer through Package.dictionary.
                            let package = Package(identifier: $0.product.id, packageType: .custom,
                                                  storeProduct: $0.product, offeringIdentifier: "", webCheckoutUrl: nil)
                            return ["product": package.dictionary["product"] ?? NSNull()]
                        }
                    ]
                } ?? NSNull()
                self?.notifyListeners("checkpointPassed", data: [
                    "callId": callId, "result": ["customer": customer, "flow": flow]
                ])
            }
        }
    }
}

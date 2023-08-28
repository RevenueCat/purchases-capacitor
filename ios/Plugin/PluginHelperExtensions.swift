import Foundation
import Capacitor
import PurchasesHybridCommon
import RevenueCat

internal extension PurchasesPlugin {
    func rejectIfPurchasesNotConfigured(_ call: CAPPluginCall) -> Bool {
        if !Purchases.isConfigured {
            call.reject("Purchases must be configured before calling this function")
            return false
        }
        return true
    }

    func rejectUnsupportedInIOS(_ call: CAPPluginCall) {
        call.unimplemented("This functionality is not available in iOS")
    }

    func rejectWithErrorContainer(_ call: CAPPluginCall, error: ErrorContainer) {
        call.reject("Error \(error.code), \(error.message)", "\(error.code)", error.error)
    }

    func getCompletionBlockHandler(_ call: CAPPluginCall,
                                   wrapperKey: String? = nil) -> (([String: Any]?, ErrorContainer?) -> Void) {
        func handleResponse(response: [String: Any]?, error: ErrorContainer?) {
            if let error {
                rejectWithErrorContainer(call, error: error)
            } else if let response {
                let mapToResolve: [String: Any] = {
                    if let wrapperKey {
                        return [wrapperKey: response]
                    } else {
                        return response
                    }
                }()
                call.resolve(mapToResolve)
            } else {
                call.reject("Incorrect completion. No response nor error passed.")
            }
        }
        return handleResponse
    }

    func getBeginRefundRequestCompletion(_ call: CAPPluginCall) -> (ErrorContainer?) -> Void {
        func resolveWithCode(_ code: Int) {
            call.resolve([
                "refundRequestStatus": code
            ])
        }
        func handleResponse(error: ErrorContainer?) {
            if let error {
                if error.info["userCancelled"] != nil {
                    resolveWithCode(RefundRequestStatus.userCancelled.rawValue)
                } else {
                    resolveWithCode(RefundRequestStatus.error.rawValue)
                }
            } else {
                resolveWithCode(RefundRequestStatus.success.rawValue)
            }
        }
        return handleResponse
    }
}

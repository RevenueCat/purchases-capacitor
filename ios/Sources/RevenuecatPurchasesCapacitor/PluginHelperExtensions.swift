import Foundation
import Capacitor
import PurchasesHybridCommon
import RevenueCat

internal extension PurchasesPlugin {
    // Returns true when this optional path handled the request, including rejection.
    func purchaseWithIntroductoryOfferEligibilityJWSIfPresent(_ call: CAPPluginCall,
                                                             options: [String: Any]) -> Bool {
        guard let value = call.options["introductoryOfferEligibilityJWS"], !(value is NSNull) else {
            return false
        }
        guard let token = value as? String, !token.isEmpty else {
            call.reject("introductoryOfferEligibilityJWS must be a non-empty string.",
                        String(ErrorCode.purchaseInvalidError.rawValue))
            return true
        }
        // An older PHC accepts arbitrary options but would silently discard this token.
        guard CommonFunctionality.responds(to: NSSelectorFromString("purchase:introductoryOfferEligibilityJWS:completionBlock:")) else {
            call.reject("This PurchasesHybridCommon version does not support introductory offer eligibility JWS.",
                        String(ErrorCode.unsupportedError.rawValue))
            return true
        }
        var options = options
        options["introductoryOfferEligibilityJWS"] = token
        CommonFunctionality.purchase(options: options, completion: self.getCompletionBlockHandler(call))
        return true
    }

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
        call.reject("\(error.message)", "\(error.code)", error.error, error.info)
    }

    func getNullableCompletionBlockHandler(_ call: CAPPluginCall,
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
                call.resolve()
            }
        }
        return handleResponse
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

    func getCompletionBlockHandlerForArrayResponse(
        _ call: CAPPluginCall,
        wrapperKey: String
    ) -> ([[String: Any]]?, ErrorContainer?) -> Void {
        func handleResponse(response: [[String: Any]]?, error: ErrorContainer?) {
            if let error {
                rejectWithErrorContainer(call, error: error)
            } else if let response {
                let mapToResolve: [String: Any] = [wrapperKey: response]
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

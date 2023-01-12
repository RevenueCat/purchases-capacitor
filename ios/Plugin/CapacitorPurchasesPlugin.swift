import Foundation
import Capacitor
import RevenueCat
import PurchasesHybridCommon
import StoreKit

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(CapacitorPurchasesPlugin)
public class CapacitorPurchasesPlugin: CAPPlugin, PurchasesDelegate {

    public let PLUGIN_VERSION: String = "2.4.0"

    @objc func setup(_ call: CAPPluginCall) {
        let apiKey = call.getString("apiKey", "")
        let appUserID = call.getString("appUserID", "")
        let observerMode = call.getBool("observerMode", false)
        let platformInfo = Purchases.PlatformInfo(flavor: "capacitor", version: self.PLUGIN_VERSION)
        let configuration: Configuration
        if appUserID != "" {
            configuration = Configuration.Builder(withAPIKey: apiKey)
                .with(appUserID: appUserID)
                .with(observerMode: observerMode)
                .with(platformInfo: platformInfo)
                .build()
        } else {
            configuration = Configuration.Builder(withAPIKey: apiKey)
                .with(observerMode: observerMode)
                .with(platformInfo: platformInfo)
                .build()
        }
        Purchases.configure(with: configuration)
        Purchases.shared.delegate = self
        call.resolve()
    }

    public func purchases(_ purchases: Purchases, receivedUpdated purchaserInfo: CustomerInfo) {
        let purchaserJson = purchaserInfo.dictionary
        self.notifyListeners("purchasesUpdate", data: ["purchaserInfo": purchaserJson])
    }

    @objc func getOfferings(_ call: CAPPluginCall) {
        Purchases.shared.getOfferings { (offerings, error) in
            if (error) != nil {
                call.reject("getOfferings failed")
            } else {
                let offJson = offerings?.dictionary
                if offJson != nil {
                    call.resolve([
                        "offerings": offJson as Any
                    ])
                } else {
                    call.reject("getOfferings failed to convert in json")
                }
            }
        }
    }

    @objc func purchasePackage(_ call: CAPPluginCall) {
        let identifier = call.getString("identifier", "")
        let offeringIdentifier = call.getString("offeringIdentifier", "")
        if identifier == "" || offeringIdentifier == "" {
            call.reject("No package provided")
            return
        }
        Purchases.shared.getOfferings { (offerings, error) in
            if (error) != nil {
                call.reject("getOfferings failed")
            } else {
                let offering = offerings?.offering(identifier: offeringIdentifier)
                let package = offering?.package(identifier: identifier)
                if package == nil {
                    call.reject("cannot found package in current offering")
                    return
                }
                Purchases.shared.purchase(package: package!) { (_, purchaserInfo, error, _) in
                    if (error) != nil {
                        call.reject("Restore failed")
                    } else {
                        let purchase = purchaserInfo?.dictionary
                        if purchase != nil {
                            call.resolve([
                                "purchaserInfo": purchase as Any
                            ])
                        } else {
                            call.reject("purchasePackage failed to convert in json")
                        }
                    }
                }
            }
        }
    }

    @objc func restorePurchases(_ call: CAPPluginCall) {
        Purchases.shared.restorePurchases { purchaserInfo, error in
            if (error) != nil {
                call.reject("Restore failed")
            } else {
                let purchase = purchaserInfo?.dictionary
                if purchase != nil {
                    call.resolve([
                        "purchaserInfo": purchase as Any
                    ])
                } else {
                    call.reject("listener failed to convert in json")
                }
            }
        }
    }

    @objc func setAttributes(_ call: CAPPluginCall) {
        let attributes = call.getObject("attributes") ?? [:]
        Purchases.shared.attribution.setAttributes((attributes as? [String: String])!)
        call.resolve()
    }

    @objc func logIn(_ call: CAPPluginCall) {
        let appUserID = call.getString("appUserID") ?? ""
        Purchases.shared.logIn(appUserID) { (purchaserInfo, created, error) in
            if (error) != nil {
                call.reject("Login failed")
            } else {
                let purchase = purchaserInfo?.dictionary
                if purchase != nil {
                    call.resolve([
                        "purchaserInfo": purchase as Any,
                        "created": created
                    ])
                } else {
                    call.reject("logIn failed to convert in json")
                }
            }
        }
    }

    @objc func logOut(_ call: CAPPluginCall) {
        Purchases.shared.logOut { (purchaserInfo, error) in
            if (error) != nil {
                call.reject("Logout failed")
            } else {
                let purchase = purchaserInfo?.dictionary
                if purchase != nil {
                    call.resolve([
                        "purchaserInfo": purchase as Any
                    ])
                } else {
                    call.reject("logOut failed to convert in json")
                }
            }
        }
    }

    @objc func getCustomerInfo(_ call: CAPPluginCall) {
        Purchases.shared.getCustomerInfo { (purchaserInfo, error) in
            if (error) != nil {
                call.reject("Get purchaser info failed")
            } else {
                let purchase = purchaserInfo?.dictionary
                if purchase != nil {
                    call.resolve([
                        "purchaserInfo": purchase as Any
                    ])
                } else {
                    call.reject("getCustomerInfo failed to convert in json")
                }
            }
        }
    }

    @objc func setDebugLogsEnabled(_ call: CAPPluginCall) {
        let enabled = call.getBool("enabled") ?? false
        Purchases.logLevel = enabled ? .debug : .error
        call.resolve()
    }
}

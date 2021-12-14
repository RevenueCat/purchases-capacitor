import Foundation
import Capacitor
import Purchases

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(CapacitorPurchasesPlugin)
public class CapacitorPurchasesPlugin: CAPPlugin {

    @objc func setup(_ call: CAPPluginCall) {
        let apiKey = call.getString("apiKey") ?? ""
        Purchases.configure(withAPIKey: apiKey)
        Purchases.shared.delegate = self
        call.resolve()
    }
    extension AppDelegate: PurchasesDelegate {
        func purchases(_ purchases: Purchases, didReceiveUpdated purchaserInfo: Purchases.PurchaserInfo) {
            self.notifyListeners("purchasesUpdate", data: ["purchases": purchases, "purchaserInfo": purchaserInfo])
        }
    }

    @objc func getOfferings(_ call: CAPPluginCall) {
        Purchases.shared.offerings { (offerings, error) in
            if (error) {
                call.reject(error.localizedDescription)
            } else {
                call.resolve([
                    "offerings": offerings
                ])
            }
        }
    }

    @objc func purchasePackage(_ call: CAPPluginCall) {
        let productIdentifier = call.getObject("aPackage") ?? [:]
        try {
        const {purchaserInfo, productIdentifier} = await Purchases.purchasePackage(package);
            if (typeof purchaserInfo.entitlements.active.my_entitlement_identifier !== "undefined") {
                call.resolve()
            } else {
                call.reject("Purchase failed")
            }
        } catch (e) {
            if (!e.userCancelled) {
                print(e);
                call.reject("Canceled")
            }
        }
    }

    @objc func restoreTransactions(_ call: CAPPluginCall) {
        Purchases.shared.restoreTransactions { purchaserInfo, error in
            if (error) {
                call.reject("Restore failed")
            } else {
                call.resolve([
                    "purchaserInfo": purchaserInfo
                ])
            }
        }
    }
    @objc func setAttributes(_ call: CAPPluginCall) {
        let attributes = call.getObject("attributes") ?? [:]
        Purchases.shared.setAttributes(attributes)
        call.resolve()
    }
    @objc func logIn(_ call: CAPPluginCall) {
        let appUserID = call.getString("appUserID") ?? ""
        Purchases.shared.logIn(appUserID) { (purchaserInfo, created, error) in
            if (error) {
                call.reject("Login failed")
            } else {
                call.resolve([
                        "purchaserInfo": purchaserInfo,
                        "created": created
                ])
            }
        }
    }
    @objc func logOut(_ call: CAPPluginCall) {
        Purchases.shared.logOut() { (purchaserInfo, created, error) in
            if (error) {
                call.reject("Logout failed")
            } else {
                call.resolve([
                        "purchaserInfo": purchaserInfo,
                        "created": created
                ])
            }
        }
    }
    @objc func getPurchaserInfo(_ call: CAPPluginCall) {
        Purchases.shared.purchaserInfo { (purchaserInfo, error) in
            if (error) {
                call.reject("Get purchaser info failed")
            } else {
                call.resolve([
                        "purchaserInfo": purchaserInfo,
                ])
            }
        }
    }
    @objc func setDebugLogsEnabled(_ call: CAPPluginCall) {
        let enabled = call.getBool("enabled") ?? false
        Purchases.logLevel = enabled ? .debug : .error
        call.resolve()
    }
}

import Foundation
import Capacitor
import Purchases

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(CapacitorPurchasesPlugin)
public class CapacitorPurchasesPlugin: CAPPlugin, PurchasesDelegate {

    @objc func setup(_ call: CAPPluginCall) {
        let apiKey = call.getString("apiKey") ?? ""
        Purchases.configure(withAPIKey: apiKey)
        Purchases.shared.delegate = self
        call.resolve()
    }
    
    public func purchases(_ purchases: Purchases, didReceiveUpdated purchaserInfo: Purchases.PurchaserInfo) {
        self.notifyListeners("purchasesUpdate", data: ["purchases": purchases, "purchaserInfo": purchaserInfo])
    }

    @objc func getOfferings(_ call: CAPPluginCall) {
        Purchases.shared.offerings { (offerings, error) in
            if ((error) != nil) {
                call.reject("getOfferings failed")
            } else {
                call.resolve([
                    "offerings": offerings!
                ])
            }
        }
    }

    @objc func purchasePackage(_ call: CAPPluginCall) {
        let aPackage = call.getObject("aPackage") ?? [:]
//    identifier: String, packageType: PackageType, storeProduct: StoreProduct, offeringIdentifier: String
//        let package = new Purchases.Package(identifier: aPackage["identifier"],packageType: aPackage["packageType"], storeProduct: aPackage["storeProduct"], offeringIdentifier: aPackage["offeringIdentifier"])
//        Purchases.Package.
//        if let package = [Purchases.Package].from(data: aPackage) {
//            print("Casting good")
//        } else {
//
//            print("Casting error")
//        }
// this line still fails
        Purchases.shared.purchasePackage(aPackage) { (transaction, purchaserInfo, error, userCancelled) in
            if ((error) != nil) {
                call.reject("Restore failed")
            } else {
                if purchaserInfo!.entitlements["your_entitlement_id"]?.isActive == true {
                    // Unlock that great "pro" content
                    call.resolve()
                } else {
                    call.reject("Purchase failed")
                }
            }
        }
    }

    @objc func restoreTransactions(_ call: CAPPluginCall) {
        Purchases.shared.restoreTransactions { purchaserInfo, error in
            if ((error) != nil) {
                call.reject("Restore failed")
            } else {
                call.resolve([
                    "purchaserInfo": purchaserInfo!
                ])
            }
        }
    }
    @objc func setAttributes(_ call: CAPPluginCall) {
        let attributes = call.getObject("attributes") ?? [:]
        Purchases.shared.setAttributes((attributes as? [String: String])!)
        call.resolve()
    }
    @objc func logIn(_ call: CAPPluginCall) {
        let appUserID = call.getString("appUserID") ?? ""
        Purchases.shared.logIn(appUserID) { (purchaserInfo, created, error) in
            if ((error) != nil) {
                call.reject("Login failed")
            } else {
                call.resolve([
                    "purchaserInfo": purchaserInfo!,
                        "created": created
                ])
            }
        }
    }
    @objc func logOut(_ call: CAPPluginCall) {
        Purchases.shared.logOut() { (purchaserInfo, error) in
            if ((error) != nil) {
                call.reject("Logout failed")
            } else {
                call.resolve([
                        "purchaserInfo": purchaserInfo!
                ])
            }
        }
    }
    @objc func getPurchaserInfo(_ call: CAPPluginCall) {
        Purchases.shared.purchaserInfo { (purchaserInfo, error) in
            if ((error) != nil) {
                call.reject("Get purchaser info failed")
            } else {
                call.resolve([
                    "purchaserInfo": purchaserInfo!,
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

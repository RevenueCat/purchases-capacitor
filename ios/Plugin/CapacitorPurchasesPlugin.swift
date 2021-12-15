import Foundation
import Capacitor
import RevenueCat
import StoreKit


@objc public extension SKProductSubscriptionPeriod {
    func toJson() -> [String: Any]? {
        return [
            "numberOfUnits": numberOfUnits,
            "unit": unit.rawValue
        ]
    }
}

@objc public extension SKProductDiscount {
    @available(iOS 12.2, *)
    func toJson() -> [String: Any]? {
        return [
            "identifier": identifier as Any,
            "type": type.rawValue,
            "price": price,
            "currency": priceLocale.currencySymbol as Any,
            "paymentMode": paymentMode.rawValue,
            "numberOfPeriods": numberOfPeriods,
            "subscriptionPeriod": subscriptionPeriod.toJson() as Any,
        ]
    }
}

@objc public extension SKProduct {
    func toJson() -> [String: Any]? {
        var isFamilyShareable = false
        var discounts: [Any] = []
        var introPrice: Any = [:]
        if #available(iOS 14, *) {
            isFamilyShareable = self.isFamilyShareable
        }
        if #available(iOS 12.2, *) {
            for disc in self.discounts {
                discounts.append(disc.toJson() as Any)
            }
            introPrice = introductoryPrice?.toJson() as Any
        }
        return [
            "localizedDescription": localizedDescription,
            "localizedTitle": localizedTitle,
            "price": price,
            "currency": priceLocale.currencySymbol as Any,
            "productIdentifier": productIdentifier,
            "isFamilyShareable": isFamilyShareable,
            "subscriptionGroupIdentifier": subscriptionGroupIdentifier as Any,
            "subscriptionPeriod": subscriptionPeriod?.toJson() as Any,
            "introductoryPrice": introPrice,
            "discounts": discounts,
        ]
    }
}

@objc public extension Package {
    func toJson() -> [String: Any]? {
        return [
            "identifier": identifier,
            "packageType": packageType.rawValue,
            "product": product.toJson() as Any,
            "offeringIdentifier": offeringIdentifier
        ]
    }
}

@objc public extension Offering {
    func toJson() -> [String: Any]? {
        var allPack: [Any] = []
        for pack in availablePackages {
            allPack.append(pack.toJson()!)
        }
        return [
            "identifier": identifier,
            "serverDescription": serverDescription,
            "availablePackages": allPack,
        ]
    }
}

@objc public extension Offerings {
    func toJson() -> [String: Any]? {
        var allJson: [String: Any] = [:]
        for (id, off) in all {
            allJson[id] = off.toJson()
        }
        return [
            "description": description,
            "current": current?.toJson() as Any,
            "all": allJson
        ]
    }
}
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
    
    public func purchases(_ purchases: Purchases, receivedUpdated purchaserInfo: CustomerInfo) {
        self.notifyListeners("purchasesUpdate", data: ["purchases": purchases, "purchaserInfo": purchaserInfo])
    }

    @objc func getOfferings(_ call: CAPPluginCall) {
        Purchases.shared.getOfferings { (offerings, error) in
            if ((error) != nil) {
                call.reject("getOfferings failed")
            } else {
                let offJson = offerings?.toJson()
                print(offJson as Any)
                if(offJson != nil) {
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
        let aPackage = call.getObject("aPackage") ?? [:]
        let identifier = aPackage["identifier"] as! String
        let identifierOff = aPackage["offeringIdentifier"] as! String
        Purchases.shared.getOfferings { (offerings, error) in
            if ((error) != nil) {
                call.reject("getOfferings failed")
            } else {
                let offering = offerings?.offering(identifier: identifierOff)
                let package = offering?.package(identifier: identifier)
                if (package == nil) {
                    call.reject("cannot found package in current offering")
                    return
                }
                Purchases.shared.purchase(package: package!) { (transaction, purchaserInfo, error, userCancelled) in
                    if ((error) != nil) {
                        call.reject("Restore failed")
                    } else {
                        if purchaserInfo!.entitlements["your_entitlement_id"]?.isActive == true {
                            call.resolve()
                        } else {
                            call.reject("Purchase failed")
                        }
                    }
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
        Purchases.shared.getCustomerInfo { (purchaserInfo, error) in
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

import Foundation
import Capacitor
import RevenueCat
import StoreKit

extension ISO8601DateFormatter {
    convenience init(_ formatOptions: Options) {
        self.init()
        self.formatOptions = formatOptions
    }
}
extension Formatter {
    static let iso8601withFractionalSeconds = ISO8601DateFormatter([.withInternetDateTime, .withFractionalSeconds])
}
extension Date {
    var iso8601withFractionalSeconds: String { return Formatter.iso8601withFractionalSeconds.string(from: self) }
}
extension String {
    var iso8601withFractionalSeconds: Date? { return Formatter.iso8601withFractionalSeconds.date(from: self) }
}

@objc public extension RevenueCat.StoreTransaction {
    func toJson() -> [String: Any] {
        return [
            "productId": productIdentifier,
            "revenueCatId": transactionIdentifier,
            "purchaseDate": purchaseDate.iso8601withFractionalSeconds,
        ]
    }
}
@objc public extension EntitlementInfos {
    func toJson() -> [String: Any] {
        var allJson: [String: Any] = [:]
        var activeJson: [String: Any] = [:]
        for (id, ent) in all {
            allJson[id] = ent.rawData
        }
        for (id, activ) in active {
            activeJson[id] = activ.rawData
        }
        return [
            "active": activeJson,
            "all": allJson
        ]
    }
}
@objc public extension CustomerInfo {
    func toJson() -> [String: Any] {
        return [
            "entitlements": entitlements.toJson(),
            "activeSubscriptions": Array(activeSubscriptions),
            "allPurchasedProductIdentifiers": Array(allPurchasedProductIdentifiers),
            "nonSubscriptionTransactions": [nonSubscriptionTransactions[0].toJson()],
            "latestExpirationDate": latestExpirationDate?.iso8601withFractionalSeconds as Any,
            "firstSeen": firstSeen.iso8601withFractionalSeconds,
            "originalAppUserId": originalAppUserId,
            "requestDate": requestDate.iso8601withFractionalSeconds,
            "originalApplicationVersion": originalApplicationVersion as Any,
            "originalPurchaseDate": originalPurchaseDate?.iso8601withFractionalSeconds as Any,
            "managementURL": managementURL?.absoluteString as Any
        ]
    }
}

@objc public extension SubscriptionPeriod {
    func toJson() -> [String: Any] {
        return [
            "numberOfUnits": value,
            "unit": unit.rawValue
        ]
    }
}

@objc public extension SKProductSubscriptionPeriod {
    func toJson() -> [String: Any] {
        return [
            "numberOfUnits": numberOfUnits,
            "unit": unit.rawValue
        ]
    }
}

@objc public extension StoreProductDiscount {
    @available(iOS 12.2, *)
    var localizedPrice: String {
        if(sk1Discount == nil) {
            return ""
        }
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.locale = sk1Discount?.priceLocale
        return formatter.string(from: NSNumber(nonretainedObject: price))!
    }

    @available(iOS 12.2, *)
    func toJson() -> [String: Any] {
        return [
            "identifier": offerIdentifier as Any,
            "type": paymentMode,
            "price": price,
            "localizedPrice": localizedPrice,
            "currencySymbol": sk1Discount?.priceLocale.currencySymbol as Any,
            "currencyCode": sk1Discount?.priceLocale.currencyCode as Any,
            "paymentMode": paymentMode.rawValue,
            "numberOfPeriods": subscriptionPeriod.value,
            "subscriptionPeriod": subscriptionPeriod.toJson(),
        ]
    }
}

@objc public extension StoreProduct {
    
    func toJson() -> [String: Any] {
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
            introPrice = introductoryDiscount?.toJson() as Any
        }
        return [
            "description": localizedDescription,
            "title": localizedTitle,
            "price": price,
            "priceString": localizedPriceString,
            "currencySymbol": priceFormatter?.currencySymbol as Any,
            "currencyCode": priceFormatter?.currencyCode as Any,
            "identifier": productIdentifier,
            "isFamilyShareable": isFamilyShareable,
            "subscriptionGroupIdentifier": subscriptionGroupIdentifier as Any,
            "subscriptionPeriod": subscriptionPeriod?.toJson() as Any,
            "introductoryPrice": introPrice,
            "discounts": discounts,
        ]
    }
}

public extension PackageType {
// copied from revenueCat sdk
    var description: String? {
        switch self {
        case .unknown: return nil
        case .custom: return nil
        case .lifetime: return "$rc_lifetime"
        case .annual: return "$rc_annual"
        case .sixMonth: return "$rc_six_month"
        case .threeMonth: return "$rc_three_month"
        case .twoMonth: return "$rc_two_month"
        case .monthly: return "$rc_monthly"
        case .weekly: return "$rc_weekly"
        }
    }
    func toJson() -> String? {
        return self.description?.replacingOccurrences(of: "$rc_", with: "").uppercased()
    }

    static var typesByDescription: [String: PackageType] {
        [
            "$rc_lifetime": .lifetime,
            "$rc_annual": .annual,
            "$rc_six_month": .sixMonth,
            "$rc_three_month": .threeMonth,
            "$rc_two_month": .twoMonth,
            "$rc_monthly": .monthly,
            "$rc_weekly": .weekly
        ]
    }
}

@objc public extension Package {
    func toJson() -> [String: Any] {
        return [
            "identifier": identifier,
            "packageType": packageType.toJson() as Any,
            "product": storeProduct.toJson(),
            "offeringIdentifier": offeringIdentifier
        ]
    }
}

@objc public extension Offering {
    func toJson() -> [String: Any] {
        var allPack: [Any] = []
        for pack in availablePackages {
            allPack.append(pack.toJson())
        }
        return [
            "identifier": identifier,
            "serverDescription": serverDescription,
            "availablePackages": allPack,
            "lifetime": lifetime?.toJson() as Any,
            "annual": annual?.toJson() as Any,
            "sixMonth": sixMonth?.toJson() as Any,
            "threeMonth": threeMonth?.toJson() as Any,
            "twoMonth": twoMonth?.toJson() as Any,
            "monthly": monthly?.toJson() as Any,
            "weekly": weekly?.toJson() as Any,
        ]
    }
}

@objc public extension Offerings {
    func toJson() -> [String: Any] {
        var allJson: [String: Any] = [:]
        for (id, off) in all {
            allJson[id] = off.toJson()
        }
        let currentJson = current?.toJson() ?? [:]
        return [
            "current": (currentJson.isEmpty ? nil : currentJson) as Any,
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
        let identifier = call.getString("identifier") ?? ""
        let offeringIdentifier = call.getString("offeringIdentifier") ?? ""
        if(identifier == "" || offeringIdentifier == "") {
            call.reject("No package provided")
            return
        }
        Purchases.shared.getOfferings { (offerings, error) in
            if ((error) != nil) {
                call.reject("getOfferings failed")
            } else {
                let offering = offerings?.offering(identifier: offeringIdentifier)
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
                            call.resolve([
                                "purchaserInfo": purchaserInfo?.toJson() as Any
                            ])
                        } else {
                            call.reject("Purchase failed")
                        }
                    }
                }
            }
        }
    }

    @objc func restoreTransactions(_ call: CAPPluginCall) {
        Purchases.shared.restorePurchases { purchaserInfo, error in
            if ((error) != nil) {
                call.reject("Restore failed")
            } else {
                call.resolve([
                    "purchaserInfo": purchaserInfo?.toJson() as Any
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
                    "purchaserInfo": purchaserInfo?.toJson() as Any,
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
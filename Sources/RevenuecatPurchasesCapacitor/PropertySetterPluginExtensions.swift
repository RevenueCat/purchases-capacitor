import Foundation
import Capacitor
import PurchasesHybridCommon

public extension PurchasesPlugin {

    @objc func setAttributes(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        let attributes = call.jsObjectRepresentation
        if attributes.isEmpty {
            call.resolve()
            return
        }
        CommonFunctionality.setAttributes(attributes)
        call.resolve()
    }

    @objc func setEmail(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        let email = call.getString("email")
        CommonFunctionality.setEmail(email)
        call.resolve()
    }

    @objc func setPhoneNumber(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        let phoneNumber = call.getString("phoneNumber")
        CommonFunctionality.setPhoneNumber(phoneNumber)
        call.resolve()
    }

    @objc func setDisplayName(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        let displayName = call.getString("displayName")
        CommonFunctionality.setDisplayName(displayName)
        call.resolve()
    }

    @objc func setPushToken(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        let pushToken = call.getString("pushToken")
        CommonFunctionality.setPushToken(pushToken)
        call.resolve()
    }

    @objc func setAdjustID(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        let adjustID = call.getString("adjustID")
        CommonFunctionality.setAdjustID(adjustID)
        call.resolve()
    }

    @objc func setAppsflyerID(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        let appsflyerID = call.getString("appsflyerID")
        CommonFunctionality.setAppsflyerID(appsflyerID)
        call.resolve()
    }

    @objc func setFBAnonymousID(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        let fbAnonymousID = call.getString("fbAnonymousID")
        CommonFunctionality.setFBAnonymousID(fbAnonymousID)
        call.resolve()
    }

    @objc func setMparticleID(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        let mparticleID = call.getString("mparticleID")
        CommonFunctionality.setMparticleID(mparticleID)
        call.resolve()
    }

    @objc func setCleverTapID(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        let cleverTapID = call.getString("cleverTapID")
        CommonFunctionality.setCleverTapID(cleverTapID)
        call.resolve()
    }

    @objc func setMixpanelDistinctID(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        let mixpanelDistinctID = call.getString("mixpanelDistinctID")
        CommonFunctionality.setMixpanelDistinctID(mixpanelDistinctID)
        call.resolve()
    }

    @objc func setFirebaseAppInstanceID(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        let firebaseAppInstanceID = call.getString("firebaseAppInstanceID")
        CommonFunctionality.setFirebaseAppInstanceID(firebaseAppInstanceID)
        call.resolve()
    }

    @objc func setOnesignalID(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        let onesignalID = call.getString("onesignalID")
        CommonFunctionality.setOnesignalID(onesignalID)
        call.resolve()
    }

    @objc func setOnesignalUserID(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        let onesignalUserID = call.getString("onesignalUserID")
        CommonFunctionality.setOnesignalUserID(onesignalUserID)
        call.resolve()
    }

    @objc func setAirshipChannelID(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        let airshipChannelID = call.getString("airshipChannelID")
        CommonFunctionality.setAirshipChannelID(airshipChannelID)
        call.resolve()
    }

    @objc func setMediaSource(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        let mediaSource = call.getString("mediaSource")
        CommonFunctionality.setMediaSource(mediaSource)
        call.resolve()
    }

    @objc func setCampaign(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        let campaign = call.getString("campaign")
        CommonFunctionality.setCampaign(campaign)
        call.resolve()
    }

    @objc func setAdGroup(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        let adGroup = call.getString("adGroup")
        CommonFunctionality.setAdGroup(adGroup)
        call.resolve()
    }

    @objc func setAd(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        let adProperty = call.getString("ad")
        CommonFunctionality.setAd(adProperty)
        call.resolve()
    }

    @objc func setKeyword(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        let keyword = call.getString("keyword")
        CommonFunctionality.setKeyword(keyword)
        call.resolve()
    }

    @objc func setCreative(_ call: CAPPluginCall) {
        guard self.rejectIfPurchasesNotConfigured(call) else { return }
        let creative = call.getString("creative")
        CommonFunctionality.setCreative(creative)
        call.resolve()
    }
}

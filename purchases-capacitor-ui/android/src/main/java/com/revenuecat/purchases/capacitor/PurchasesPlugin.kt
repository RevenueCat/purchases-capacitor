@file:Suppress("unused")

package com.revenuecat.purchases.capacitor

import android.app.Activity
import com.getcapacitor.*
import com.revenuecat.purchases.CustomerInfo
import com.revenuecat.purchases.Purchases
import com.revenuecat.purchases.PurchasesConfiguration
import com.revenuecat.purchases.PurchasesError
import com.revenuecat.purchases.ui.revenuecatui.PaywallListener
import com.revenuecat.purchases.ui.revenuecatui.activity.PaywallActivity
import com.revenuecat.purchases.ui.revenuecatui.PaywallCloseReason
import org.json.JSONObject

@CapacitorPlugin(name = "RevenueCatUI")
class PurchasesPlugin : Plugin() {

    // ---------- Public JS methods ----------

    /**
     * Initializes the Purchases SDK.
     *
     * JS:  await RevenueCatUI.configure({ apiKey: "public_sdk_key", userId?: "xyz" })
     */
    @PluginMethod
    fun configure(call: PluginCall) {
        val apiKey = call.getString("apiKey")
        if (apiKey.isNullOrBlank()) {
            call.reject("apiKey is required")
            return
        }
        val userId = call.getString("userId")

        val config = PurchasesConfiguration.Builder(bridge.context, apiKey)
            .apply {
                if (!userId.isNullOrBlank()) appUserID(userId)
            }
            .build()

        Purchases.configure(config)
        call.resolve()
    }

    /**
     * Presents a native RevenueCat paywall for the given Offering identifier.
     *
     * JS: await RevenueCatUI.presentPaywall({ offering: "pro_monthly" })
     */
    @PluginMethod
    fun presentPaywall(call: PluginCall) {
        val offeringId = call.getString("offering") ?: "default"
        val activity: Activity = bridge.activity

        PaywallActivity.launch(
            activity,
            offeringId,
            object : PaywallListener {
                override fun onDismissed(closeReason: PaywallCloseReason) {
                    val data = JSObject().apply {
                        put("closeReason", PaywallCloseReasonMapper.map(closeReason))
                    }
                    notifyListeners(RCConstants.EVENT_PAYWALL_CLOSED, data)
                }

                override fun onPurchased(info: CustomerInfo) {
                    val data = JSObject().apply {
                        put("closeReason", "purchased")
                        put("customerInfo", CustomerInfoMapper.map(info))
                    }
                    notifyListeners(RCConstants.EVENT_PAYWALL_CLOSED, data)
                }

                override fun onError(error: PurchasesError) {
                    val data = JSObject().apply {
                        put("error", ErrorMapper.map(error))
                    }
                    notifyListeners(RCConstants.EVENT_PAYWALL_ERROR, data)
                }
            }
        )
        call.resolve()
    }
}

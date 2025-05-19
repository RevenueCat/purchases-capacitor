package com.revenuecat.purchases.capacitor

import com.revenuecat.purchases.CustomerInfo
import org.json.JSONObject

/**
 * Converts RevenueCat's [CustomerInfo] into a plain [JSONObject] that can be
 * sent across the Capacitor bridge without additional serialization work on
 * the JS‑side.
 */
object CustomerInfoMapper {
    fun map(info: CustomerInfo): JSONObject {
        val json = JSONObject()
        val entitlements = JSONObject()
        for ((key, value) in info.entitlements.all) {
            entitlements.put(key, value.isActive)
        }
        json.put("entitlements", entitlements)
        json.put("originalAppUserId", info.originalAppUserId)
        json.put("activeSubscriptions", info.activeSubscriptions)
        json.put("allPurchasedProductIdentifiers", info.allPurchasedProductIdentifiers)
        json.put("latestExpirationDateMillis", info.latestExpirationDate?.time ?: JSONObject.NULL)
        return json
    }
}

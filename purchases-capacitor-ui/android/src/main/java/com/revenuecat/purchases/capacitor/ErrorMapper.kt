package com.revenuecat.purchases.capacitor

import com.revenuecat.purchases.PurchasesError
import com.revenuecat.purchases.PurchasesErrorCode
import org.json.JSONObject

/**
 * Converts a [PurchasesError] to a serialisable [JSONObject].
 */
object ErrorMapper {
    fun map(error: PurchasesError): JSONObject {
        val json = JSONObject()
        json.put("message", error.message)
        json.put("code", error.code.name)
        json.put("underlyingErrorMessage", error.underlyingErrorMessage ?: JSONObject.NULL)
        return json
    }

    fun codeName(code: PurchasesErrorCode): String = code.name
}

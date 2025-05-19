package com.revenuecat.purchases.capacitor

import com.revenuecat.purchases.ui.revenuecatui.PaywallCloseReason

/**
 * Converts [PaywallCloseReason] into a stable string value for the web side.
 */
object PaywallCloseReasonMapper {
    fun map(reason: PaywallCloseReason): String = when (reason) {
        PaywallCloseReason.CANCELLED -> "cancelled"
        PaywallCloseReason.PURCHASED -> "purchased"
        PaywallCloseReason.RESTORED  -> "restored"
        PaywallCloseReason.ERROR     -> "error"
    }
}

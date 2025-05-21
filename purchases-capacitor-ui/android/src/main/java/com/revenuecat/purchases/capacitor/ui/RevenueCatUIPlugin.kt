package com.revenuecat.purchases.capacitor.ui

import android.content.Intent
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.fragment.app.FragmentActivity
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.revenuecat.purchases.hybridcommon.ui.PaywallResultListener
import com.revenuecat.purchases.hybridcommon.ui.PaywallSource
import com.revenuecat.purchases.hybridcommon.ui.PresentPaywallOptions
import com.revenuecat.purchases.hybridcommon.ui.presentPaywallFromFragment
import com.revenuecat.purchases.ui.revenuecatui.customercenter.ShowCustomerCenter

@CapacitorPlugin(name = "RevenueCatUI")
class RevenueCatUIPlugin : Plugin(), PaywallResultListener {

    private var savedCall: PluginCall? = null
    private var customerCenterLauncher: ActivityResultLauncher<Intent>? = null

    override fun load() {
        super.load()

        // Register an ActivityResultLauncher for the Customer Center flow
        customerCenterLauncher = activity.registerForActivityResult(
            ActivityResultContracts.StartActivityForResult()
        ) {
            // Regardless of the result we just resolve the call
            savedCall?.resolve()
            savedCall = null
        }
    }

    @PluginMethod
    fun presentPaywall(call: PluginCall) {
        savedCall = call

        val offeringIdentifier = call.getString("offeringIdentifier")
        val displayCloseButton = call.getBoolean("displayCloseButton", false)

        val currentActivity = activity
        if (currentActivity !is FragmentActivity) {
            call.reject(
                "PAYWALLS_MISSING_ACTIVITY",
                "Paywalls require your activity to subclass FragmentActivity"
            )
            return
        }

        val paywallSource = offeringIdentifier?.let { PaywallSource.OfferingIdentifier(it) }
            ?: PaywallSource.DefaultOffering

        val options = PresentPaywallOptions(
            paywallSource = paywallSource,
            requiredEntitlementIdentifier = null,
            shouldDisplayDismissButton = displayCloseButton,
            paywallResultListener = this
        )

        presentPaywallFromFragment(currentActivity, options)
        notifyListeners("paywallDisplayed", JSObject())
    }

    @PluginMethod
    fun presentPaywallIfNeeded(call: PluginCall) {
        val requiredEntitlementIdentifier = call.getString("requiredEntitlementIdentifier")
        if (requiredEntitlementIdentifier.isNullOrEmpty()) {
            call.reject("Required entitlement identifier is required")
            return
        }

        savedCall = call

        val offeringIdentifier = call.getString("offeringIdentifier")
        val displayCloseButton = call.getBoolean("displayCloseButton", false)

        val currentActivity = activity
        if (currentActivity !is FragmentActivity) {
            call.reject(
                "PAYWALLS_MISSING_ACTIVITY",
                "Paywalls require your activity to subclass FragmentActivity"
            )
            return
        }

        val paywallSource = offeringIdentifier?.let { PaywallSource.OfferingIdentifier(it) }
            ?: PaywallSource.DefaultOffering

        val options = PresentPaywallOptions(
            paywallSource = paywallSource,
            requiredEntitlementIdentifier = requiredEntitlementIdentifier,
            shouldDisplayDismissButton = displayCloseButton,
            paywallResultListener = this
        )

        presentPaywallFromFragment(currentActivity, options)
        notifyListeners("paywallDisplayed", JSObject())
    }

    @PluginMethod
    fun presentCustomerCenter(call: PluginCall) {
        val currentActivity = activity
        if (currentActivity == null) {
            call.reject(
                "CUSTOMER_CENTER_MISSING_ACTIVITY",
                "Could not present Customer Center. There's no activity"
            )
            return
        }

        savedCall = call

        val intent = ShowCustomerCenter().createIntent(currentActivity, Unit)
        customerCenterLauncher?.launch(intent)
    }

    // region PaywallResultListener
    override fun onPaywallResult(paywallResult: String) {
        val jsObject = JSObject().apply {
            put("result", paywallResult)
        }

        savedCall?.resolve(jsObject)
        notifyListeners("paywallDismissed", JSObject())
        savedCall = null
    }
    // endregion
} 
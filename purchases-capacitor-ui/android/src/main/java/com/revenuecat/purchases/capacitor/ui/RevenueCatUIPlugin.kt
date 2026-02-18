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
import com.revenuecat.purchases.PresentedOfferingContext
import com.revenuecat.purchases.hybridcommon.ui.PaywallListenerWrapper
import com.revenuecat.purchases.hybridcommon.ui.PaywallResultListener
import com.revenuecat.purchases.hybridcommon.ui.PaywallSource
import com.revenuecat.purchases.hybridcommon.ui.PresentPaywallOptions
import com.revenuecat.purchases.hybridcommon.ui.HybridPurchaseLogicBridge
import com.revenuecat.purchases.hybridcommon.ui.presentPaywallFromFragment
import com.revenuecat.purchases.ui.revenuecatui.customercenter.ShowCustomerCenter
import org.json.JSONObject

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
        val offering = call.getObject("offering")
        val offeringIdentifier = offering?.getString("identifier")
        val presentedOfferingContext = offering?.optJSONArray("availablePackages")
            ?.optJSONObject(0)
            ?.optJSONObject("presentedOfferingContext")
        val displayCloseButton = call.getBoolean("displayCloseButton") ?: false

        presentPaywallInternal(
            call = call,
            offeringIdentifier = offeringIdentifier,
            presentedOfferingContext = presentedOfferingContext,
            displayCloseButton = displayCloseButton,
            requiredEntitlementIdentifier = null
        )
    }

    @PluginMethod
    fun presentPaywallIfNeeded(call: PluginCall) {
        val requiredEntitlementIdentifier = call.getString("requiredEntitlementIdentifier")
        if (requiredEntitlementIdentifier.isNullOrEmpty()) {
            call.reject(
                "PAYWALL_ERROR",
                "Required entitlement identifier is required"
            )
            return
        }

        val offering = call.getObject("offering")
        val offeringIdentifier = offering?.getString("identifier")
        val presentedOfferingContext = offering?.optJSONArray("availablePackages")
            ?.optJSONObject(0)
            ?.optJSONObject("presentedOfferingContext")
        val displayCloseButton = call.getBoolean("displayCloseButton") ?: false

        presentPaywallInternal(
            call = call,
            offeringIdentifier = offeringIdentifier,
            presentedOfferingContext = presentedOfferingContext,
            displayCloseButton = displayCloseButton,
            requiredEntitlementIdentifier = requiredEntitlementIdentifier
        )
    }

    @PluginMethod
    fun resumePurchaseInitiated(call: PluginCall) {
        val requestId = call.getString("requestId")
        if (requestId == null) {
            call.reject("PAYWALL_ERROR", "Missing requestId")
            return
        }
        val shouldProceed = call.getBoolean("shouldProceed") ?: true
        PaywallListenerWrapper.resumePurchasePackageInitiated(requestId, shouldProceed)
        call.resolve()
    }

    @PluginMethod
    fun resumePurchaseLogicPurchase(call: PluginCall) {
        val requestId = call.getString("requestId")
        if (requestId == null) {
            call.reject("PAYWALL_ERROR", "Missing requestId")
            return
        }
        val resultString = call.getString("result")
        if (resultString == null) {
            call.reject("PAYWALL_ERROR", "Missing result")
            return
        }
        val errorMessage = call.getObject("error")?.optString("message")
        HybridPurchaseLogicBridge.resolveResult(requestId, resultString, errorMessage)
        call.resolve()
    }

    @PluginMethod
    fun resumePurchaseLogicRestore(call: PluginCall) {
        val requestId = call.getString("requestId")
        if (requestId == null) {
            call.reject("PAYWALL_ERROR", "Missing requestId")
            return
        }
        val resultString = call.getString("result")
        if (resultString == null) {
            call.reject("PAYWALL_ERROR", "Missing result")
            return
        }
        val errorMessage = call.getObject("error")?.optString("message")
        HybridPurchaseLogicBridge.resolveResult(requestId, resultString, errorMessage)
        call.resolve()
    }

    /**
     * Shared implementation for presenting a paywall
     */
    private fun presentPaywallInternal(
        call: PluginCall,
        offeringIdentifier: String?,
        presentedOfferingContext: JSONObject?,
        displayCloseButton: Boolean,
        requiredEntitlementIdentifier: String?
    ) {
        // Check if there's already a presentation in progress
        if (savedCall != null) {
            call.reject(
                "PAYWALL_ERROR",
                "A paywall presentation is already in progress"
            )
            return
        }

        savedCall = call

        val currentActivity = activity
        if (currentActivity !is FragmentActivity) {
            call.reject(
                "PAYWALL_ERROR",
                "Paywalls require your activity to subclass FragmentActivity"
            )
            return
        }

        val hasPaywallListener = call.getBoolean("hasPaywallListener") ?: false
        val hasPurchaseLogic = call.getBoolean("hasPurchaseLogic") ?: false

        val presentedOfferingContext = presentedOfferingContext?.let { jsContext ->
            val offeringId = jsContext.optString("offeringIdentifier").takeUnless { it.isNullOrEmpty() }
            if (offeringId == null) { return@let null }
            val placementIdentifier = jsContext.optString("placementIdentifier").takeUnless { it.isNullOrEmpty() }
            val targetingContext = jsContext.optJSONObject("targetingContext")?.let { targetingContext ->
                val revision = targetingContext.optInt("revision", -1).takeUnless { it == -1 }
                val ruleId = targetingContext.optString("ruleId").takeUnless { it.isNullOrEmpty() }
                if (revision == null || ruleId == null) { return@let null }
                PresentedOfferingContext.TargetingContext(
                    revision = revision,
                    ruleId = ruleId,
                )
            }
            PresentedOfferingContext(
                offeringIdentifier = offeringId,
                placementIdentifier = placementIdentifier,
                targetingContext = targetingContext,
            )
        }

        val paywallSource = if (offeringIdentifier != null && presentedOfferingContext != null) {
            PaywallSource.OfferingIdentifierWithPresentedOfferingContext(
                offeringIdentifier = offeringIdentifier,
                presentedOfferingContext = presentedOfferingContext,
            )
        } else {
            PaywallSource.DefaultOffering
        }

        val listener = if (hasPaywallListener) createPaywallListenerWrapper() else null
        val purchaseLogic = if (hasPurchaseLogic) createPurchaseLogicBridge() else null

        val options = PresentPaywallOptions(
            paywallSource = paywallSource,
            requiredEntitlementIdentifier = requiredEntitlementIdentifier,
            shouldDisplayDismissButton = displayCloseButton,
            paywallResultListener = this,
            paywallListener = listener,
            purchaseLogic = purchaseLogic,
        )

        presentPaywallFromFragment(currentActivity, options)
        notifyListeners("paywallDisplayed", JSObject())
    }

    private fun createPaywallListenerWrapper(): PaywallListenerWrapper {
        return object : PaywallListenerWrapper() {
            override fun onPurchaseStarted(rcPackage: Map<String, Any?>) {
                notifyListeners("onPurchaseStarted", JSObject().apply {
                    put("packageBeingPurchased", JSONObject(rcPackage))
                })
            }

            override fun onPurchaseCompleted(
                customerInfo: Map<String, Any?>,
                storeTransaction: Map<String, Any?>,
            ) {
                notifyListeners("onPurchaseCompleted", JSObject().apply {
                    put("customerInfo", JSONObject(customerInfo))
                    put("storeTransaction", JSONObject(storeTransaction))
                })
            }

            override fun onPurchaseError(error: Map<String, Any?>) {
                notifyListeners("onPurchaseError", JSObject().apply {
                    put("error", JSONObject(error))
                })
            }

            override fun onPurchaseCancelled() {
                notifyListeners("onPurchaseCancelled", JSObject())
            }

            override fun onRestoreStarted() {
                notifyListeners("onRestoreStarted", JSObject())
            }

            override fun onRestoreCompleted(customerInfo: Map<String, Any?>) {
                notifyListeners("onRestoreCompleted", JSObject().apply {
                    put("customerInfo", JSONObject(customerInfo))
                })
            }

            override fun onRestoreError(error: Map<String, Any?>) {
                notifyListeners("onRestoreError", JSObject().apply {
                    put("error", JSONObject(error))
                })
            }

            override fun onPurchasePackageInitiated(rcPackage: Map<String, Any?>, requestId: String) {
                notifyListeners("onPurchaseInitiated", JSObject().apply {
                    put("package", JSONObject(rcPackage))
                    put("requestId", requestId)
                })
            }
        }
    }

    private fun createPurchaseLogicBridge(): HybridPurchaseLogicBridge {
        return HybridPurchaseLogicBridge(
            onPerformPurchase = { eventData ->
                notifyListeners("onPerformPurchaseRequest", JSObject(JSONObject(eventData).toString()))
            },
            onPerformRestore = { eventData ->
                notifyListeners("onPerformRestoreRequest", JSObject(JSONObject(eventData).toString()))
            },
        )
    }

    @PluginMethod
    fun presentCustomerCenter(call: PluginCall) {
        val currentActivity = activity
        if (currentActivity == null) {
            call.reject(
                "CUSTOMER_CENTER_ERROR",
                "Could not present Customer Center. There's no activity"
            )
            return
        }

        // Check if there's already a presentation in progress
        if (savedCall != null) {
            call.reject(
                "CUSTOMER_CENTER_ERROR",
                "A customer center presentation is already in progress"
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

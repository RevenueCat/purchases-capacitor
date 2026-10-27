package com.revenuecat.purchases.capacitor.ui

import android.app.Dialog
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.view.ViewGroup
import android.view.Window
import android.widget.FrameLayout
import android.widget.TextView
import android.webkit.WebView
import com.getcapacitor.JSObject
import com.getcapacitor.PluginCall
import com.revenuecat.purchases.InternalRevenueCatAPI
import com.revenuecat.purchases.hybridcommon.mappers.map
import com.revenuecat.purchases.ui.revenuecatui.InviteOnlyCheckpointsAPI
import com.revenuecat.purchases.ui.revenuecatui.checkpoints.CheckpointFailureKind
import com.revenuecat.purchases.ui.revenuecatui.checkpoints.ErrorPresenter
import org.json.JSONObject
import java.util.UUID

/** Throwaway spike. Reparents the same WebView, preserving the existing Capacitor bridge. */
@OptIn(InviteOnlyCheckpointsAPI::class, InternalRevenueCatAPI::class)
internal class CheckpointErrorBridge(private val plugin: RevenueCatUIPlugin) {
    private data class Pending(val callId: String, val complete: () -> Unit)
    private val pending = mutableMapOf<String, Pending>()
    private val activeCalls = mutableSetOf<String>()
    private var host: WebViewErrorHost? = null
    private var owner: String? = null

    fun presenter(callId: String): ErrorPresenter {
        activeCalls.add(callId)
        return ErrorPresenter { params, completion ->
            plugin.activity.runOnUiThread {
                if (callId !in activeCalls) {
                    completion.complete()
                } else {
                    emit(callId, when (params.kind) {
                        CheckpointFailureKind.FLOW_COULD_NOT_BE_SHOWN -> "flowCouldNotBeShown"
                        CheckpointFailureKind.FLOW_RESULT_SYNC_FAILED -> "flowResultSyncFailed"
                        else -> "flowActionFailed"
                    }, params.error.map().info) { completion.complete() }
                }
            }
        }
    }

    private fun emit(callId: String, kind: String, error: Map<String, Any?>, complete: () -> Unit) {
        val requestId = UUID.randomUUID().toString()
        pending[requestId] = Pending(callId, complete)
        plugin.emitCheckpointError(JSObject().apply {
            put("callId", callId)
            put("requestId", requestId)
            put("kind", kind)
            put("error", JSONObject(error))
        })
    }

    fun show(call: PluginCall) {
        val callId = call.getString("callId") ?: ""
        val requestId = call.getString("requestId") ?: ""
        if (pending[requestId]?.callId != callId || host != null) {
            call.reject("No pending error or WebView host is already in use", "ERROR_HOST_FAILED")
            return
        }
        try {
            val next = WebViewErrorHost(plugin.bridge.webView, plugin.activity)
            host = next
            owner = requestId
            next.show()
            call.resolve()
        } catch (error: Exception) {
            host?.close()
            host = null
            owner = null
            call.reject("Could not show WebView error host", "ERROR_HOST_FAILED", error)
        }
    }

    fun complete(callId: String, requestId: String) {
        val request = pending[requestId]?.takeIf { it.callId == callId } ?: return
        pending.remove(requestId)
        if (owner == requestId) {
            host?.close()
            host = null
            owner = null
        }
        request.complete()
    }

    fun cancel(callId: String) {
        activeCalls.remove(callId)
        pending.filterValues { it.callId == callId }.keys.toList().forEach { complete(callId, it) }
    }

    fun cancelAll() { activeCalls.toList().forEach { cancel(it) } }

    fun probe(callId: String) {
        activeCalls.add(callId)
        val dialog = Dialog(plugin.activity, android.R.style.Theme_Material_Light_NoActionBar_Fullscreen)
        dialog.setCancelable(false)
        val label = TextView(plugin.activity).apply {
            text = "Synthetic native modal\nCustom DOM error will appear above this"
            gravity = android.view.Gravity.TOP or android.view.Gravity.CENTER_HORIZONTAL
            setPadding(24, (120 * resources.displayMetrics.density).toInt(), 24, 0)
            setTextColor(Color.WHITE)
            setBackgroundColor(Color.rgb(0, 100, 220))
        }
        dialog.setContentView(label)
        dialog.show()
        dialog.window?.setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
        emit(callId, "flowActionFailed", mapOf(
            "code" to 0, "message" to "Synthetic error. This proves WebView layering, not a real purchase failure.",
            "readableErrorCode" to "UNKNOWN_ERROR",
        )) { dialog.dismiss() }
    }
}

private class WebViewErrorHost(
    private val webView: WebView,
    activity: android.app.Activity,
) {
    private val originalParent = webView.parent as ViewGroup
    private val originalIndex = originalParent.indexOfChild(webView)
    private val originalLayout = webView.layoutParams
    private val originalBackground = webView.background
    private val dialog = Dialog(activity, android.R.style.Theme_Translucent_NoTitleBar)
    private val container = FrameLayout(activity)

    fun show() {
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE)
        dialog.setCancelable(false)
        dialog.window?.setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))
        originalParent.removeView(webView)
        webView.setBackgroundColor(Color.TRANSPARENT)
        container.addView(webView, FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))
        dialog.setContentView(container)
        dialog.show()
        dialog.window?.setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
    }

    fun close() {
        container.removeView(webView)
        if (webView.parent == null) {
            originalParent.addView(webView, originalIndex.coerceAtMost(originalParent.childCount), originalLayout)
        }
        webView.background = originalBackground
        dialog.dismiss()
    }
}

// Created by Antonio Pallares.

package com.revenuecat.purchases.capacitor

import android.content.Context
import com.getcapacitor.Bridge
import com.getcapacitor.JSObject
import com.getcapacitor.PluginCall
import com.revenuecat.purchases.CustomerInfo
import com.revenuecat.purchases.Purchases
import com.revenuecat.purchases.hybridcommon.configure
import com.revenuecat.purchases.hybridcommon.mappers.mapAsync
import com.revenuecat.purchases.interfaces.UpdatedCustomerInfoListener
import io.mockk.Runs
import io.mockk.every
import io.mockk.just
import io.mockk.mockk
import io.mockk.mockkObject
import io.mockk.mockkStatic
import io.mockk.slot
import io.mockk.unmockkAll
import io.mockk.verify
import org.junit.After
import org.junit.Before
import org.junit.Test

class CustomerInfoListenerTests {
    private val plugin = PurchasesPlugin()
    private val bridge = mockk<Bridge>(relaxed = true)
    private val nativeListener = slot<UpdatedCustomerInfoListener>()

    @Before
    fun setUp() {
        val context = mockk<Context>()
        val purchases = mockk<Purchases>()
        val configureCall = mockk<PluginCall>(relaxed = true)
        every { bridge.context } returns context
        every { context.applicationContext } returns context
        every { configureCall.getString("apiKey") } returns "test-api-key"
        every { purchases.updatedCustomerInfoListener = capture(nativeListener) } just Runs

        mockkObject(Purchases.Companion)
        every { Purchases.sharedInstance } returns purchases
        every { Purchases.isConfigured } returns true
        mockkStatic(::configure)
        every {
            configure(any(), any(), any(), any(), any(), any(), any(), any(), any(), any(), any(), any(), any(), any())
        } just Runs
        mockkStatic(CustomerInfo::mapAsync)

        plugin.setBridge(bridge)
        plugin.configure(configureCall)
    }

    @After
    fun tearDown() {
        unmockkAll()
    }

    @Test
    fun `listener added after an update receives that customer info`() {
        nativeListener.captured.onReceived(customerInfo("first"))

        val call = addListener("listener")

        verify { call.setKeepAlive(true) }
        verify(exactly = 1) { call.resolve(match { it.getString("originalAppUserId") == "first" }) }
    }

    @Test
    fun `listener added after multiple updates receives only the latest customer info`() {
        nativeListener.captured.onReceived(customerInfo("first"))
        nativeListener.captured.onReceived(customerInfo("latest"))

        val call = addListener("listener")

        verify(exactly = 1) { call.resolve(any<JSObject>()) }
        verify { call.resolve(match { it.getString("originalAppUserId") == "latest" }) }
    }

    @Test
    fun `each new listener receives the latest customer info`() {
        nativeListener.captured.onReceived(customerInfo("latest"))

        val firstCall = addListener("first-listener")
        val secondCall = addListener("second-listener")

        verify(exactly = 1) { firstCall.resolve(match { it.getString("originalAppUserId") == "latest" }) }
        verify(exactly = 1) { secondCall.resolve(match { it.getString("originalAppUserId") == "latest" }) }
    }

    @Test
    fun `listener added before any customer info waits for the next update`() {
        val call = addListener("listener")
        verify(exactly = 0) { call.resolve(any<JSObject>()) }

        nativeListener.captured.onReceived(customerInfo("first"))

        verify(exactly = 1) { call.resolve(match { it.getString("originalAppUserId") == "first" }) }
    }

    private fun addListener(callbackId: String): PluginCall {
        val call = mockk<PluginCall>(relaxed = true)
        every { call.callbackId } returns callbackId
        every { bridge.getSavedCall(callbackId) } returns call
        plugin.addCustomerInfoUpdateListener(call)
        return call
    }

    private fun customerInfo(appUserId: String): CustomerInfo {
        val info = mockk<CustomerInfo>()
        every { info.mapAsync(any()) } answers {
            secondArg<(Map<String, Any?>) -> Unit>().invoke(mapOf("originalAppUserId" to appUserId))
        }
        return info
    }
}

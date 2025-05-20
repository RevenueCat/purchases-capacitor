package com.revenuecat.purchases.capacitor.ui;

import android.content.Intent;
import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.revenuecat.purchases.hybrid.common.CustomerInfo;
import com.revenuecat.purchases.hybrid.common.ui.CustomerCenterHelper;
import com.revenuecat.purchases.hybrid.common.ui.PaywallActivityLauncher;
import com.revenuecat.purchases.hybrid.common.ui.PaywallResult;
import com.revenuecat.purchases.hybrid.common.ui.PaywallResultHandler;

@CapacitorPlugin(name = "RevenueCatUI")
public class RevenueCatUIPlugin extends Plugin implements PaywallResultHandler {

    private PluginCall savedCall;
    private PaywallActivityLauncher paywallLauncher;
    private ActivityResultLauncher<Intent> customerCenterLauncher;

    @Override
    public void load() {
        super.load();

        paywallLauncher = new PaywallActivityLauncher(getActivity(), this);

        customerCenterLauncher = getActivity()
            .registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                new ActivityResultCallback<ActivityResult>() {
                    @Override
                    public void onActivityResult(ActivityResult result) {
                        if (savedCall != null) {
                            savedCall.resolve();
                            savedCall = null;
                        }
                    }
                }
            );
    }

    @PluginMethod
    public void presentPaywall(final PluginCall call) {
        savedCall = call;
        String offeringIdentifier = call.getString("offeringIdentifier");
        Boolean displayCloseButton = call.getBoolean("displayCloseButton", false);

        if (offeringIdentifier != null && !offeringIdentifier.isEmpty()) {
            // Launch paywall with specific offering
            paywallLauncher.launch(offeringIdentifier, displayCloseButton);
            notifyListeners("paywallDisplayed", new JSObject());
        } else {
            // Launch paywall with current offering
            paywallLauncher.launch(displayCloseButton);
            notifyListeners("paywallDisplayed", new JSObject());
        }
    }

    @PluginMethod
    public void presentPaywallIfNeeded(final PluginCall call) {
        String requiredEntitlementIdentifier = call.getString("requiredEntitlementIdentifier");
        if (requiredEntitlementIdentifier == null || requiredEntitlementIdentifier.isEmpty()) {
            call.reject("Required entitlement identifier is required");
            return;
        }

        savedCall = call;
        String offeringIdentifier = call.getString("offeringIdentifier");
        Boolean displayCloseButton = call.getBoolean("displayCloseButton", false);

        if (offeringIdentifier != null && !offeringIdentifier.isEmpty()) {
            // Launch paywall if needed with specific offering
            paywallLauncher.launchIfNeeded(requiredEntitlementIdentifier, offeringIdentifier, displayCloseButton);
            notifyListeners("paywallDisplayed", new JSObject());
        } else {
            // Launch paywall if needed with current offering
            paywallLauncher.launchIfNeeded(requiredEntitlementIdentifier, displayCloseButton);
            notifyListeners("paywallDisplayed", new JSObject());
        }
    }

    @PluginMethod
    public void presentCustomerCenter(PluginCall call) {
        savedCall = call;
        Intent intent = CustomerCenterHelper.newIntent(getActivity());
        customerCenterLauncher.launch(intent);
    }

    @Override
    public void onActivityResult(PaywallResult result) {
        if (savedCall == null) {
            return;
        }

        JSObject jsObject = new JSObject();
        
        if (result == PaywallResult.PURCHASED) {
            jsObject.put("result", "PURCHASED");
        } else if (result == PaywallResult.RESTORED) {
            jsObject.put("result", "RESTORED");
        } else if (result == PaywallResult.CANCELLED) {
            jsObject.put("result", "CANCELLED");
        } else {
            jsObject.put("result", "ERROR");
        }
        
        savedCall.resolve(jsObject);
        notifyListeners("paywallDismissed", new JSObject());
        savedCall = null;
    }
}

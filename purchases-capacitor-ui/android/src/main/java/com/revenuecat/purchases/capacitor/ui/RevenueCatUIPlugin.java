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
import com.revenuecat.purchases.CustomerInfo;
import com.revenuecat.purchases.Offerings;
import com.revenuecat.purchases.Purchases;
import com.revenuecat.purchases.ui.CustomerCenterActivity;
import com.revenuecat.purchases.ui.revenuecatui.PaywallActivity;
import com.revenuecat.purchases.ui.revenuecatui.PaywallOptions;
import com.revenuecat.purchases.ui.revenuecatui.PaywallResult;

@CapacitorPlugin(name = "RevenueCatUI")
public class RevenueCatUIPlugin extends Plugin {

    private PluginCall savedCall;
    private ActivityResultLauncher<Intent> paywallLauncher;
    private ActivityResultLauncher<Intent> customerCenterLauncher;

    @Override
    public void load() {
        super.load();

        paywallLauncher = getActivity()
            .registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                new ActivityResultCallback<ActivityResult>() {
                    @Override
                    public void onActivityResult(ActivityResult result) {
                        handlePaywallResult(result);
                    }
                }
            );

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
        // Gracefully handle unsupported feature on Android
        JSObject result = new JSObject();
        result.put("result", "NOT_PRESENTED");
        call.resolve(result);

        // Log warning that this feature is not available on Android yet
        getActivity()
            .runOnUiThread(() -> {
                Purchases.getSharedInstance().logMessage("RevenueCatUI warning: Paywalls are not supported on Android yet.");
            });
    }

    @PluginMethod
    public void presentPaywallIfNeeded(final PluginCall call) {
        // Gracefully handle unsupported feature on Android
        JSObject result = new JSObject();
        result.put("result", "NOT_PRESENTED");
        call.resolve(result);

        // Log warning that this feature is not available on Android yet
        getActivity()
            .runOnUiThread(() -> {
                Purchases.getSharedInstance().logMessage("RevenueCatUI warning: Paywalls are not supported on Android yet.");
            });
    }

    @PluginMethod
    public void presentCustomerCenter(PluginCall call) {
        // Gracefully handle unsupported feature on Android
        call.resolve();

        // Log warning that this feature is not available on Android yet
        getActivity()
            .runOnUiThread(() -> {
                Purchases.getSharedInstance().logMessage("RevenueCatUI warning: Customer Center is not supported on Android yet.");
            });
    }

    private void launchPaywall(com.revenuecat.purchases.Offering offering, PluginCall call) {
        savedCall = call;
        Intent intent = PaywallActivity.newIntent(getActivity(), offering);
        notifyListeners("paywallDisplayed", new JSObject());
        paywallLauncher.launch(intent);
    }

    private void handlePaywallResult(ActivityResult result) {
        if (savedCall == null) {
            return;
        }

        if (result.getResultCode() == PaywallResult.PURCHASED.getResultCode()) {
            JSObject jsObject = new JSObject();
            jsObject.put("result", "PURCHASED");
            savedCall.resolve(jsObject);
        } else if (result.getResultCode() == PaywallResult.RESTORED.getResultCode()) {
            JSObject jsObject = new JSObject();
            jsObject.put("result", "RESTORED");
            savedCall.resolve(jsObject);
        } else if (result.getResultCode() == PaywallResult.CANCELLED.getResultCode()) {
            JSObject jsObject = new JSObject();
            jsObject.put("result", "CANCELLED");
            savedCall.resolve(jsObject);
        } else {
            JSObject jsObject = new JSObject();
            jsObject.put("result", "ERROR");
            savedCall.resolve(jsObject);
        }

        notifyListeners("paywallDismissed", new JSObject());
        savedCall = null;
    }
}

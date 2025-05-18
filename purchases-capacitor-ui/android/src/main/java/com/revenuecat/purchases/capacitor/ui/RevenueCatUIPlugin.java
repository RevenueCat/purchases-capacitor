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
        
        paywallLauncher = getActivity().registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            new ActivityResultCallback<ActivityResult>() {
                @Override
                public void onActivityResult(ActivityResult result) {
                    handlePaywallResult(result);
                }
            }
        );
        
        customerCenterLauncher = getActivity().registerForActivityResult(
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
        String offeringIdentifier = call.getString("offeringIdentifier");
        
        if (offeringIdentifier != null) {
            Purchases.getSharedInstance().getOfferings(new Purchases.GetOfferingsListener() {
                @Override
                public void onReceived(Offerings offerings) {
                    if (offerings.getOffering(offeringIdentifier) != null) {
                        launchPaywall(offerings.getOffering(offeringIdentifier), call);
                    } else {
                        call.reject("Offering not found: " + offeringIdentifier);
                    }
                }
                
                @Override
                public void onError(Exception error) {
                    call.reject("Failed to get offerings: " + error.getMessage());
                }
            });
        } else {
            Purchases.getSharedInstance().getOfferings(new Purchases.GetOfferingsListener() {
                @Override
                public void onReceived(Offerings offerings) {
                    if (offerings.getCurrentOffering() != null) {
                        launchPaywall(offerings.getCurrentOffering(), call);
                    } else {
                        call.reject("No current offering found");
                    }
                }
                
                @Override
                public void onError(Exception error) {
                    call.reject("Failed to get offerings: " + error.getMessage());
                }
            });
        }
    }
    
    @PluginMethod
    public void presentPaywallIfNeeded(final PluginCall call) {
        String requiredEntitlementIdentifier = call.getString("requiredEntitlementIdentifier");
        if (requiredEntitlementIdentifier == null) {
            call.reject("Required entitlement identifier is missing");
            return;
        }
        
        Purchases.getSharedInstance().getCustomerInfo(new Purchases.GetCustomerInfoListener() {
            @Override
            public void onReceived(CustomerInfo customerInfo) {
                if (customerInfo.getEntitlements().get(requiredEntitlementIdentifier) != null && 
                    customerInfo.getEntitlements().get(requiredEntitlementIdentifier).isActive()) {
                    JSObject result = new JSObject();
                    result.put("result", "NOT_PRESENTED");
                    call.resolve(result);
                    return;
                }
                
                String offeringIdentifier = call.getString("offeringIdentifier");
                
                if (offeringIdentifier != null) {
                    Purchases.getSharedInstance().getOfferings(new Purchases.GetOfferingsListener() {
                        @Override
                        public void onReceived(Offerings offerings) {
                            if (offerings.getOffering(offeringIdentifier) != null) {
                                launchPaywall(offerings.getOffering(offeringIdentifier), call);
                            } else if (offerings.getCurrentOffering() != null) {
                                launchPaywall(offerings.getCurrentOffering(), call);
                            } else {
                                call.reject("No offering found");
                            }
                        }
                        
                        @Override
                        public void onError(Exception error) {
                            call.reject("Failed to get offerings: " + error.getMessage());
                        }
                    });
                } else {
                    Purchases.getSharedInstance().getOfferings(new Purchases.GetOfferingsListener() {
                        @Override
                        public void onReceived(Offerings offerings) {
                            if (offerings.getCurrentOffering() != null) {
                                launchPaywall(offerings.getCurrentOffering(), call);
                            } else {
                                call.reject("No current offering found");
                            }
                        }
                        
                        @Override
                        public void onError(Exception error) {
                            call.reject("Failed to get offerings: " + error.getMessage());
                        }
                    });
                }
            }
            
            @Override
            public void onError(Exception error) {
                call.reject("Failed to get customer info: " + error.getMessage());
            }
        });
    }
    
    @PluginMethod
    public void presentCustomerCenter(PluginCall call) {
        savedCall = call;
        Intent intent = CustomerCenterActivity.newIntent(getActivity());
        notifyListeners("paywallDisplayed", new JSObject());
        customerCenterLauncher.launch(intent);
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
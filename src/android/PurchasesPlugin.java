package com.revenuecat.purchases;

import android.support.annotation.Nullable;
import android.util.Log;

import com.android.billingclient.api.SkuDetails;
import com.appfeel.cordova.annotated.android.plugin.AnnotatedCordovaPlugin;
import com.appfeel.cordova.annotated.android.plugin.ExecutionThread;
import com.appfeel.cordova.annotated.android.plugin.PluginAction;
import com.revenuecat.purchases.interfaces.GetSkusResponseListener;
import com.revenuecat.purchases.interfaces.PurchaseCompletedListener;
import com.revenuecat.purchases.interfaces.ReceiveEntitlementsListener;
import com.revenuecat.purchases.interfaces.ReceivePurchaserInfoListener;
import com.revenuecat.purchases.interfaces.UpdatedPurchaserInfoListener;
import com.revenuecat.purchases.util.Iso8601Utils;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.jetbrains.annotations.NotNull;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import androidx.annotation.NonNull;

public class PurchasesPlugin extends AnnotatedCordovaPlugin {

    private List<CallbackContext> callbackContextUpdatedPurchaserInfoListener = new ArrayList<>();

    @Override
    public void onReset() {
        super.onReset();
        Purchases.getSharedInstance().close();
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "setupPurchases", isAutofinish = true)
    private void setupPurchases(String apiKey, String appUserID, CallbackContext callbackContext) {
        Purchases.configure(this.cordova.getActivity(), apiKey, appUserID);
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "setAllowSharingStoreAccount")
    public void setAllowSharingStoreAccount(boolean allowSharingStoreAccount, CallbackContext callbackContext) {
        checkPurchases();
        Purchases.getSharedInstance().setAllowSharingPlayStoreAccount(allowSharingStoreAccount);
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "addAttributionData")
    public void addAttributionData(JSONObject data, Integer network, CallbackContext callbackContext) {
        checkPurchases();
        for (Purchases.AttributionNetwork attributionNetwork : Purchases.AttributionNetwork.values()) {
            if (attributionNetwork.getServerValue() == network) {
                Purchases.getSharedInstance().addAttributionData(data, attributionNetwork);
            }
        }
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "getEntitlements", isAutofinish = false)
    private void getEntitlements(CallbackContext callbackContext) {
        checkPurchases();

        Purchases.getSharedInstance().getEntitlements(new ReceiveEntitlementsListener() {
            @Override
            public void onReceived(@NonNull Map<String, Entitlement> entitlementMap) {
                JSONObject response = new JSONObject();
                try {
                    for (String entId : entitlementMap.keySet()) {
                        Entitlement ent = entitlementMap.get(entId);

                        JSONObject offeringsMap = new JSONObject();
                        Map<String, Offering> offerings = ent.getOfferings();

                        for (String offeringId : offerings.keySet()) {
                            Offering offering = offerings.get(offeringId);
                            SkuDetails skuDetails = offering.getSkuDetails();
                            if (skuDetails != null) {
                                JSONObject skuMap = mapSkuDetails(skuDetails);
                                offeringsMap.put(offeringId, skuMap);
                            } else {
                                offeringsMap.put(offeringId, JSONObject.NULL);
                            }
                        }
                        response.put(entId, offeringsMap);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                callbackContext.success(response);
            }

            @Override
            public void onError(@NonNull PurchasesError error) {
                callbackContext.error(mapError(error));
            }
        });
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "getProductInfo", isAutofinish = false)
    private void getProductInfo(JSONArray productIDs, String type, CallbackContext callbackContext) {
        checkPurchases();

        ArrayList<String> productIDList = new ArrayList<>();
        for (int i = 0; i < productIDs.length(); i++) {
            try {
                productIDList.add(productIDs.getString(i));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        GetSkusResponseListener listener = new GetSkusResponseListener() {
            @Override
            public void onReceived(@NonNull List<SkuDetails> skus) {
                JSONArray writableArray = new JSONArray();
                for (SkuDetails detail : skus) {
                    writableArray.put(mapSkuDetails(detail));
                }
                callbackContext.success(writableArray);
            }

            @Override
            public void onError(@NonNull PurchasesError error) {
                callbackContext.error(mapError(error));
            }
        };

        if (type.toLowerCase().equals("subs")) {
            Purchases.getSharedInstance().getSubscriptionSkus(productIDList, listener);
        } else {
            Purchases.getSharedInstance().getNonSubscriptionSkus(productIDList, listener);
        }
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "makePurchase", isAutofinish = false)
    private void makePurchase(String productIdentifier, @Nullable JSONArray oldSkus, String type,
            CallbackContext callbackContext) {
        checkPurchases();

        ArrayList<String> oldSkusList = new ArrayList<>();
        for (int i = 0; i < (oldSkus != null ? oldSkus.length() : 0); i++) {
            try {
                oldSkusList.add(oldSkus.getString(i));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        Purchases.getSharedInstance().makePurchase(this.cordova.getActivity(), productIdentifier, type, oldSkusList,
                new PurchaseCompletedListener() {
                    @Override
                    public void onCompleted(@NonNull String sku, @NonNull PurchaserInfo purchaserInfo) {
                        JSONObject object = new JSONObject();
                        try {
                            object.put("productIdentifier", sku);
                            object.put("purchaserInfo", mapPurchaserIfo(purchaserInfo));
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        callbackContext.success(object);
                    }

                    @Override
                    public void onError(@NonNull PurchasesError error) {
                        callbackContext.error(mapError(error));
                    }
                });
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "getAppUserID")
    private void getAppUserID(CallbackContext callbackContext) {
        callbackContext.success(Purchases.getSharedInstance().getAppUserID());
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "restoreTransactions", isAutofinish = false)
    private void restoreTransactions(CallbackContext callbackContext) {
        checkPurchases();
        Purchases.getSharedInstance().restorePurchases(getReceivePurchaserInfoListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "reset", isAutofinish = false)
    private void reset(CallbackContext callbackContext) {
        checkPurchases();
        Purchases.getSharedInstance().reset(getReceivePurchaserInfoListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "identify", isAutofinish = false)
    private void identify(String appUserID, CallbackContext callbackContext) {
        checkPurchases();
        Purchases.getSharedInstance().identify(appUserID, getReceivePurchaserInfoListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "createAlias", isAutofinish = false)
    private void createAlias(String newAppUserID, CallbackContext callbackContext) {
        checkPurchases();
        Purchases.getSharedInstance().createAlias(newAppUserID, getReceivePurchaserInfoListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "setUpdatedPurchaserInfoListener", isAutofinish = false)
    private void setUpdatedPurchaserInfoListener(CallbackContext callbackContext) {
        Purchases.getSharedInstance().setUpdatedPurchaserInfoListener(purchaserInfo -> {
            PluginResult result = new PluginResult(PluginResult.Status.OK, mapPurchaserIfo(purchaserInfo));
            result.setKeepCallback(true); // Keep callback
            callbackContext.sendPluginResult(result);
        });
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "removeUpdatedPurchaserInfoListener", isAutofinish = true)
    private void removeUpdatedPurchaserInfoListener(CallbackContext callbackContext) {
        Purchases.getSharedInstance().setUpdatedPurchaserInfoListener(null);
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "getPurchaserInfo", isAutofinish = false)
    private void getPurchaserInfo(CallbackContext callbackContext) {
        checkPurchases();
        Purchases.getSharedInstance().getPurchaserInfo(getReceivePurchaserInfoListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "setDebugLogsEnabled", isAutofinish = true)
    private void setDebugLogsEnabled(boolean enabled, CallbackContext callbackContext) {
        Purchases.setDebugLogsEnabled(enabled);
    }

    private ReceivePurchaserInfoListener getReceivePurchaserInfoListener(CallbackContext callbackContext) {
        return new ReceivePurchaserInfoListener() {
            @Override
            public void onReceived(@NonNull PurchaserInfo purchaserInfo) {
                callbackContext.success(mapPurchaserIfo(purchaserInfo));
            }

            @Override
            public void onError(@NonNull PurchasesError error) {
                callbackContext.success(mapError(error));
            }
        };
    }

    private void checkPurchases() {
        if (Purchases.getSharedInstance() == null) {
            throw new RuntimeException("You must call setupPurchases first");
        }
    }

    private JSONObject mapPurchaserIfo(PurchaserInfo purchaserInfo) {
        JSONObject map = new JSONObject();
        try {
            JSONArray allActiveEntitlements = new JSONArray();
            for (String activeEntitlement : purchaserInfo.getActiveEntitlements()) {
                allActiveEntitlements.put(activeEntitlement);
            }
            map.put("activeEntitlements", allActiveEntitlements);

            JSONArray allActiveSubscriptions = new JSONArray();
            for (String activeSubscription : purchaserInfo.getActiveSubscriptions()) {
                allActiveSubscriptions.put(activeSubscription);
            }
            map.put("activeSubscriptions", allActiveSubscriptions);

            JSONArray allPurchasedProductIds = new JSONArray();
            for (String productIdentifier : purchaserInfo.getAllPurchasedSkus()) {
                allPurchasedProductIds.put(productIdentifier);
            }
            map.put("allPurchasedProductIdentifiers", allPurchasedProductIds);

            Date latest = purchaserInfo.getLatestExpirationDate();
            if (latest != null) {
                map.put("latestExpirationDate", Iso8601Utils.format(latest));
            } else {
                map.put("latestExpirationDate", JSONObject.NULL);
            }

            JSONObject allExpirationDates = new JSONObject();
            Map<String, Date> dates = purchaserInfo.getAllExpirationDatesByProduct();
            for (String key : dates.keySet()) {
                Date date = dates.get(key);
                allExpirationDates.put(key, Iso8601Utils.format(date));
            }
            map.put("allExpirationDates", allExpirationDates);

            JSONObject allEntitlementExpirationDates = new JSONObject();
            for (String entitlementId : purchaserInfo.getActiveEntitlements()) {
                Date date = purchaserInfo.getExpirationDateForEntitlement(entitlementId);
                if (date != null) {
                    allEntitlementExpirationDates.put(entitlementId, Iso8601Utils.format(date));
                } else {
                    allEntitlementExpirationDates.put(entitlementId, JSONObject.NULL);
                }
            }
            map.put("expirationsForActiveEntitlements", allEntitlementExpirationDates);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return map;
    }

    private JSONObject mapError(PurchasesError purchasesError) {
        JSONObject object = new JSONObject();
        String domainString;

        if (purchasesError.getDomain() == Purchases.ErrorDomains.REVENUECAT_BACKEND) {
            domainString = "RevenueCat Backend";
        } else if (purchasesError.getDomain() == Purchases.ErrorDomains.PLAY_BILLING) {
            domainString = "Play Billing";
        } else {
            domainString = "Unknown";
        }

        try {
            object.put("message", purchasesError.getMessage());
            object.put("code", purchasesError.getCode());
            object.put("domain", domainString);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return object;
    }

    private JSONObject mapSkuDetails(final SkuDetails detail) {
        JSONObject map = new JSONObject();
        try {
            map.put("identifier", detail.getSku());
            map.put("description", detail.getDescription());
            map.put("title", detail.getTitle());
            map.put("price", detail.getPriceAmountMicros() / 1000000d);
            map.put("price_string", detail.getPrice());
            String introductoryPriceAmountMicros = detail.getIntroductoryPriceAmountMicros();
            if (introductoryPriceAmountMicros != null && !introductoryPriceAmountMicros.isEmpty()) {
                map.put("intro_price", String.valueOf(Long.parseLong(introductoryPriceAmountMicros) / 1000000d));
            } else {
                map.put("intro_price", "");
            }
            map.put("intro_price_string", detail.getIntroductoryPrice());
            map.put("intro_price_period", detail.getIntroductoryPricePeriod());
            map.put("intro_price_cycles", detail.getIntroductoryPriceCycles());

            map.put("currency_code", detail.getPriceCurrencyCode());
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return map;
    }
}
package com.revenuecat.purchases;


import androidx.annotation.Nullable;

import com.appfeel.cordova.annotated.android.plugin.AnnotatedCordovaPlugin;
import com.appfeel.cordova.annotated.android.plugin.ExecutionThread;
import com.appfeel.cordova.annotated.android.plugin.PluginAction;
import com.revenuecat.purchases.common.CommonKt;
import com.revenuecat.purchases.common.ErrorContainer;
import com.revenuecat.purchases.common.MappersKt;
import com.revenuecat.purchases.common.OnResult;
import com.revenuecat.purchases.common.OnResultList;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


public class PurchasesPlugin extends AnnotatedCordovaPlugin {

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "setupPurchases", isAutofinish = false)
    private void setupPurchases(String apiKey, String appUserID, boolean observerMode,
                                CallbackContext callbackContext) {
        Purchases.configure(this.cordova.getActivity(), apiKey, appUserID, observerMode);
        Purchases.getSharedInstance().setUpdatedPurchaserInfoListener(purchaserInfo -> {
            PluginResult result = new PluginResult(PluginResult.Status.OK, convertMapToJson(MappersKt.map(purchaserInfo)));
            result.setKeepCallback(true);
            callbackContext.sendPluginResult(result);
        });
        PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
        result.setKeepCallback(true);
        callbackContext.sendPluginResult(result);
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "setAllowSharingStoreAccount")
    public void setAllowSharingStoreAccount(boolean allowSharingStoreAccount, CallbackContext callbackContext) {
        CommonKt.setAllowSharingAppStoreAccount(allowSharingStoreAccount);
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "addAttributionData")
    public void addAttributionData(JSONObject data, Integer network, @Nullable String networkUserId,
                                   CallbackContext callbackContext) {
        CommonKt.addAttributionData(data, network, networkUserId);
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "getOfferings", isAutofinish = false)
    private void getOfferings(CallbackContext callbackContext) {
        CommonKt.getOfferings(getOnResult(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "getProductInfo", isAutofinish = false)
    private void getProductInfo(JSONArray productIDs, String type, CallbackContext callbackContext) {
        List<String> productIDList = new ArrayList<>();
        for (int i = 0; i < productIDs.length(); i++) {
            try {
                productIDList.add(productIDs.getString(i));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        CommonKt.getProductInfo(productIDList, type, new OnResultList() {
            @Override
            public void onReceived(List<Map<String, ?>> map) {
                JSONArray writableArray = new JSONArray();
                for (Map<String, ?> detail : map) {
                    writableArray.put(convertMapToJson(detail));
                }
                callbackContext.success(writableArray);
            }

            @Override
            public void onError(ErrorContainer errorContainer) {
                callbackContext.error(convertMapToJson(errorContainer.getInfo()));

            }
        });
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "purchaseProduct", isAutofinish = false)
    private void purchaseProduct(final String productIdentifier, @Nullable final String oldSKU,
                                 @Nullable final Integer prorationMode, final String type,
                                 final CallbackContext callbackContext) {
        CommonKt.purchaseProduct(
                this.cordova.getActivity(),
                productIdentifier,
                oldSKU,
                prorationMode,
                type,
                getOnResult(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "purchasePackage", isAutofinish = false)
    private void purchasePackage(final String packageIdentifier,
                                 final String offeringIdentifier,
                                 @Nullable final String oldSKU,
                                 @Nullable final Integer prorationMode,
                                 final CallbackContext callbackContext) {
        CommonKt.purchasePackage(
                this.cordova.getActivity(),
                packageIdentifier,
                offeringIdentifier,
                oldSKU,
                prorationMode,
                getOnResult(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "syncPurchases")
    public void syncPurchases(CallbackContext callbackContext) {
        CommonKt.syncPurchases();
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "getAppUserID", isAutofinish = false)
    private void getAppUserID(CallbackContext callbackContext) {
        callbackContext.success(CommonKt.getAppUserID());
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "restoreTransactions", isAutofinish = false)
    private void restoreTransactions(CallbackContext callbackContext) {
        CommonKt.restoreTransactions(getOnResult(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "reset", isAutofinish = false)
    private void reset(CallbackContext callbackContext) {
        CommonKt.reset(getOnResult(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "identify", isAutofinish = false)
    private void identify(String appUserID, CallbackContext callbackContext) {
        CommonKt.identify(appUserID, getOnResult(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "createAlias", isAutofinish = false)
    private void createAlias(String newAppUserID, CallbackContext callbackContext) {
        CommonKt.createAlias(newAppUserID, getOnResult(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "getPurchaserInfo", isAutofinish = false)
    private void getPurchaserInfo(CallbackContext callbackContext) {
        CommonKt.getPurchaserInfo(getOnResult(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setDebugLogsEnabled")
    private void setDebugLogsEnabled(boolean enabled, CallbackContext callbackContext) {
        CommonKt.setDebugLogsEnabled(enabled);
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setAutomaticAppleSearchAdsAttributionCollection")
    private void setAutomaticAppleSearchAdsAttributionCollection(boolean enabled, CallbackContext callbackContext) {
        // NOOP
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "isAnonymous")
    private void isAnonymous(CallbackContext callbackContext) {
        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, CommonKt.isAnonymous()));
    }

    private OnResult getOnResult(CallbackContext callbackContext) {
        return new OnResult() {
            @Override
            public void onReceived(Map<String, ?> map) {
                callbackContext.success(convertMapToJson(map));
            }

            @Override
            public void onError(ErrorContainer errorContainer) {
                callbackContext.error(convertMapToJson(errorContainer.getInfo()));
            }
        };
    }

    private static JSONObject convertMapToJson(Map<String, ?> readableMap) {
        JSONObject object = new JSONObject();

        try {
            for (Map.Entry<String, ?> entry : readableMap.entrySet()) {
                if (entry.getValue() == null) {
                    object.put(entry.getKey(), JSONObject.NULL);
                } else if (entry.getValue() instanceof Map) {
                    object.put(entry.getKey(), convertMapToJson((Map<String, Object>) entry.getValue()));
                } else if (entry.getValue() instanceof Object[]) {
                    object.put(entry.getKey(), convertArrayToJsonArray((Object[]) entry.getValue()));
                } else if (entry.getValue() instanceof List) {
                    object.put(entry.getKey(), convertArrayToJsonArray(((List) entry.getValue()).toArray()));
                } else if (entry.getValue() != null) {
                    object.put(entry.getKey(), entry.getValue());
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return object;
    }

    private static JSONArray convertArrayToJsonArray(Object[] array) {
        JSONArray writableArray = new JSONArray();
        for (Object item : array) {
            if (item == null) {
                writableArray.put(JSONObject.NULL);
            } else if (item instanceof Map) {
                writableArray.put(convertMapToJson((Map<String, Object>) item));
            } else if (item instanceof Object[]) {
                writableArray.put(convertArrayToJsonArray((Object[]) item));
            } else if (item instanceof List) {
                writableArray.put(convertArrayToJsonArray(((List) item).toArray()));
            } else {
                writableArray.put(item);
            }
        }
        return writableArray;
    }

}

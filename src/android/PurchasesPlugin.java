package com.revenuecat.purchases;


import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.appfeel.cordova.annotated.android.plugin.AnnotatedCordovaPlugin;
import com.appfeel.cordova.annotated.android.plugin.ExecutionThread;
import com.appfeel.cordova.annotated.android.plugin.PluginAction;
import com.revenuecat.purchases.hybridcommon.CommonKt;
import com.revenuecat.purchases.hybridcommon.ErrorContainer;
import com.revenuecat.purchases.hybridcommon.OnResult;
import com.revenuecat.purchases.hybridcommon.OnResultList;
import com.revenuecat.purchases.hybridcommon.OnResultAny;
import com.revenuecat.purchases.common.PlatformInfo;
import com.revenuecat.purchases.hybridcommon.SubscriberAttributesKt;
import com.revenuecat.purchases.hybridcommon.mappers.PurchaserInfoMapperKt;
import com.revenuecat.purchases.interfaces.UpdatedPurchaserInfoListener;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;


public class PurchasesPlugin extends AnnotatedCordovaPlugin {

    public static final String PLATFORM_NAME = "cordova";
    public static final String PLUGIN_VERSION = "2.1.1";

    @PluginAction(thread = ExecutionThread.UI, actionName = "setupPurchases", isAutofinish = false)
    private void setupPurchases(String apiKey, @Nullable String appUserID, boolean observerMode,
                                @Nullable String userDefaultsSuiteName, CallbackContext callbackContext) {
        PlatformInfo platformInfo = new PlatformInfo(PLATFORM_NAME, PLUGIN_VERSION);
        CommonKt.configure(this.cordova.getActivity(), apiKey, appUserID, observerMode, platformInfo);
        Purchases.getSharedInstance().setUpdatedPurchaserInfoListener(new UpdatedPurchaserInfoListener() {
            @Override
            public void onReceived(@NonNull PurchaserInfo purchaserInfo) {
                PluginResult result = new PluginResult(PluginResult.Status.OK, convertMapToJson(PurchaserInfoMapperKt.map(purchaserInfo)));
                result.setKeepCallback(true);
                callbackContext.sendPluginResult(result);
            }
        });
        PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
        result.setKeepCallback(true);
        callbackContext.sendPluginResult(result);
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "setAllowSharingStoreAccount")
    public void setAllowSharingStoreAccount(boolean allowSharingStoreAccount, CallbackContext callbackContext) {
        CommonKt.setAllowSharingAppStoreAccount(allowSharingStoreAccount);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "addAttributionData")
    public void addAttributionData(JSONObject data, Integer network, @Nullable String networkUserId,
                                   CallbackContext callbackContext) {
        SubscriberAttributesKt.addAttributionData(data, network, networkUserId);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "getOfferings", isAutofinish = false)
    private void getOfferings(CallbackContext callbackContext) {
        CommonKt.getOfferings(getOnResult(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "getProductInfo", isAutofinish = false)
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

    @PluginAction(thread = ExecutionThread.UI, actionName = "purchaseProduct", isAutofinish = false)
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

    @PluginAction(thread = ExecutionThread.UI, actionName = "purchasePackage", isAutofinish = false)
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

    @PluginAction(thread = ExecutionThread.UI, actionName = "syncPurchases")
    public void syncPurchases(CallbackContext callbackContext) {
        CommonKt.syncPurchases();
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "getAppUserID", isAutofinish = false)
    private void getAppUserID(CallbackContext callbackContext) {
        callbackContext.success(CommonKt.getAppUserID());
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "restoreTransactions", isAutofinish = false)
    private void restoreTransactions(CallbackContext callbackContext) {
        CommonKt.restoreTransactions(getOnResult(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "reset", isAutofinish = false)
    private void reset(CallbackContext callbackContext) {
        CommonKt.reset(getOnResult(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "identify", isAutofinish = false)
    private void identify(String appUserID, CallbackContext callbackContext) {
        CommonKt.identify(appUserID, getOnResult(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "createAlias", isAutofinish = false)
    private void createAlias(String newAppUserID, CallbackContext callbackContext) {
        CommonKt.createAlias(newAppUserID, getOnResult(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "getPurchaserInfo", isAutofinish = false)
    private void getPurchaserInfo(CallbackContext callbackContext) {
        CommonKt.getPurchaserInfo(getOnResult(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setDebugLogsEnabled")
    private void setDebugLogsEnabled(boolean enabled, CallbackContext callbackContext) {
        CommonKt.setDebugLogsEnabled(enabled);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setSimulatesAskToBuyInSandbox")
    private void setSimulatesAskToBuyInSandbox(boolean enabled, CallbackContext callbackContext) {
        // NOOP
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setAutomaticAppleSearchAdsAttributionCollection")
    private void setAutomaticAppleSearchAdsAttributionCollection(boolean enabled, CallbackContext callbackContext) {
        // NOOP
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setupShouldPurchasePromoProductCallback")
    private void setupShouldPurchasePromoProductCallback(CallbackContext callbackContext) {
        // NOOP
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "isAnonymous")
    private void isAnonymous(CallbackContext callbackContext) {
        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, CommonKt.isAnonymous()));
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "checkTrialOrIntroductoryPriceEligibility", isAutofinish = false)
    private void isAnonymous(JSONArray productIDs, CallbackContext callbackContext) {
        List<String> productIDList = new ArrayList<>();
        for (int i = 0; i < productIDs.length(); i++) {
            try {
                productIDList.add(productIDs.getString(i));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        Map<String, Map<String, Object>> map = CommonKt.checkTrialOrIntroductoryPriceEligibility(productIDList);
        callbackContext.success(convertMapToJson(map));
    }
    
    @PluginAction(thread = ExecutionThread.WORKER, actionName = "invalidatePurchaserInfoCache")
    private void invalidatePurchaserInfoCache(CallbackContext callbackContext) {
        CommonKt.invalidatePurchaserInfoCache();
        callbackContext.success();
    }
    
    @PluginAction(thread = ExecutionThread.UI, actionName = "setProxyURLString")
    public void setProxyURLString(String proxyURLString, CallbackContext callbackContext) {
        CommonKt.setProxyURLString(proxyURLString);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "canMakePayments", isAutofinish = false)
    private void canMakePayments(JSONArray features, CallbackContext callbackContext) {
        ArrayList<Integer> featureList = new ArrayList<>();
        try {
            if (features != null) {
                for (int i = 0; i < features.length(); i++) {
                    featureList.add(features.getInt(i));
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        CommonKt.canMakePayments(this.cordova.getActivity(), featureList, new OnResultAny<Boolean>() {
          @Override
          public void onError(@Nullable ErrorContainer errorContainer) {
            callbackContext.error(convertMapToJson(errorContainer.getInfo()));
          }
  
          @Override
          public void onReceived(Boolean result) {
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, result));
          }
        });
    }


    //================================================================================
    // Subscriber Attributes
    //================================================================================

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setAttributes")
    private void setAttributes(JSONObject attributes, CallbackContext callbackContext) throws JSONException {
        SubscriberAttributesKt.setAttributes(convertJsonToMap(attributes));
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setEmail")
    private void setEmail(String email, CallbackContext callbackContext) {
        SubscriberAttributesKt.setEmail(email);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setPhoneNumber")
    private void setPhoneNumber(String phoneNumber, CallbackContext callbackContext) {
        SubscriberAttributesKt.setPhoneNumber(phoneNumber);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setDisplayName")
    private void setDisplayName(String displayName, CallbackContext callbackContext) {
        SubscriberAttributesKt.setDisplayName(displayName);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setPushToken")
    private void setPushToken(String pushToken, CallbackContext callbackContext) {
        SubscriberAttributesKt.setPushToken(pushToken);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setAdjustID")
    private void setAdjustID(String adjustID, CallbackContext callbackContext) { 
        SubscriberAttributesKt.setAdjustID(adjustID);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setAppsflyerID")
    private void setAppsflyerID(String appsflyerID, CallbackContext callbackContext) { 
        SubscriberAttributesKt.setAppsflyerID(appsflyerID);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setFBAnonymousID")
    private void setFBAnonymousID(String fBAnonymousID, CallbackContext callbackContext) { 
        SubscriberAttributesKt.setFBAnonymousID(fBAnonymousID);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setMparticleID")
    private void setMparticleID(String mparticleID, CallbackContext callbackContext) { 
        SubscriberAttributesKt.setMparticleID(mparticleID);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setOnesignalID")
    private void setOnesignalID(String onesignalID, CallbackContext callbackContext) { 
        SubscriberAttributesKt.setOnesignalID(onesignalID);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setMediaSource")
    private void setMediaSource(String mediaSource, CallbackContext callbackContext) { 
        SubscriberAttributesKt.setMediaSource(mediaSource);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setCampaign")
    private void setCampaign(String campaign, CallbackContext callbackContext) { 
        SubscriberAttributesKt.setCampaign(campaign);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setAdGroup")
    private void setAdGroup(String adGroup, CallbackContext callbackContext) { 
        SubscriberAttributesKt.setAdGroup(adGroup);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setAd")
    private void setAd(String ad, CallbackContext callbackContext) { 
        SubscriberAttributesKt.setAd(ad);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setKeyword")
    private void setKeyword(String keyword, CallbackContext callbackContext) { 
        SubscriberAttributesKt.setKeyword(keyword);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setCreative")
    private void setCreative(String creative, CallbackContext callbackContext) { 
        SubscriberAttributesKt.setCreative(creative);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "collectDeviceIdentifiers")
    private void collectDeviceIdentifiers(CallbackContext callbackContext) { 
        SubscriberAttributesKt.collectDeviceIdentifiers();
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "presentCodeRedemptionSheet")
    private void presentCodeRedemptionSheet(CallbackContext callbackContext) {
        // noop
        callbackContext.success();
    }

    //================================================================================
    // Private methods
    //================================================================================

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

    private static Map<String, String> convertJsonToMap(JSONObject jsonObject) {
        HashMap map = new HashMap();
        Iterator keys = jsonObject.keys();
        while (keys.hasNext()) {
            String key = (String) keys.next();
            try {
                map.put(key, jsonObject.get(key));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return map;
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

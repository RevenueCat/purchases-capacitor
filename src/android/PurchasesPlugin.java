package com.revenuecat.purchases;

import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.SkuDetails;
import com.appfeel.cordova.annotated.android.plugin.AnnotatedCordovaPlugin;
import com.appfeel.cordova.annotated.android.plugin.ExecutionThread;
import com.appfeel.cordova.annotated.android.plugin.PluginAction;
import com.revenuecat.purchases.interfaces.GetSkusResponseListener;
import com.revenuecat.purchases.interfaces.MakePurchaseListener;
import com.revenuecat.purchases.interfaces.ReceiveEntitlementsListener;
import com.revenuecat.purchases.interfaces.ReceivePurchaserInfoListener;
import com.revenuecat.purchases.util.Iso8601Utils;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Currency;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class PurchasesPlugin extends AnnotatedCordovaPlugin {
    private Map<String, Map<String, SkuDetails>> products = new HashMap<>();

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "setupPurchases", isAutofinish = false)
    private void setupPurchases(String apiKey, String appUserID, boolean observerMode,
                                CallbackContext callbackContext) {
        Purchases.configure(this.cordova.getActivity(), apiKey, appUserID, observerMode);
        Purchases.getSharedInstance().setUpdatedPurchaserInfoListener(purchaserInfo -> {
            PluginResult result = new PluginResult(PluginResult.Status.OK, mapPurchaserIfo(purchaserInfo));
            result.setKeepCallback(true);
            callbackContext.sendPluginResult(result);
        });
        PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
        result.setKeepCallback(true);
        callbackContext.sendPluginResult(result);
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "setAllowSharingStoreAccount")
    public void setAllowSharingStoreAccount(boolean allowSharingStoreAccount, CallbackContext callbackContext) {
        Purchases.getSharedInstance().setAllowSharingPlayStoreAccount(allowSharingStoreAccount);
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "addAttributionData")
    public void addAttributionData(JSONObject data, Integer network, @Nullable String networkUserId,
                                   CallbackContext callbackContext) {
        for (Purchases.AttributionNetwork attributionNetwork : Purchases.AttributionNetwork.values()) {
            if (attributionNetwork.getServerValue() == network) {
                Purchases.addAttributionData(data, attributionNetwork, networkUserId);
            }
        }
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "getEntitlements", isAutofinish = false)
    private void getEntitlements(CallbackContext callbackContext) {
        Purchases.getSharedInstance().getEntitlements(new ReceiveEntitlementsListener() {
            @Override
            public void onReceived(@NonNull Map<String, Entitlement> entitlementMap) {
                callbackContext.success(mapEntitlementsAndCacheProducts(entitlementMap));
            }

            @Override
            public void onError(@NonNull PurchasesError error) {
                callbackContext.error(mapError(error));
            }
        });
    }

    private JSONObject mapEntitlementsAndCacheProducts(@NonNull Map<String, Entitlement> entitlementMap) {
        products = new HashMap<>();

        JSONObject response = new JSONObject();
        try {
            for (String entId : entitlementMap.keySet()) {
                Entitlement ent = entitlementMap.get(entId);

                JSONObject offeringsMap = new JSONObject();
                if (ent != null) {
                    Map<String, Offering> offerings = ent.getOfferings();
                    for (String offeringId : offerings.keySet()) {
                        Offering offering = offerings.get(offeringId);
                        if (offering != null) {
                            SkuDetails skuDetails = offering.getSkuDetails();
                            if (skuDetails != null) {
                                cacheProduct(skuDetails);
                                JSONObject skuMap = mapSkuDetails(skuDetails);
                                offeringsMap.put(offeringId, skuMap);
                            } else {
                                offeringsMap.put(offeringId, JSONObject.NULL);
                            }
                        }
                    }
                }
                response.put(entId, offeringsMap);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return response;
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "getProductInfo", isAutofinish = false)
    private void getProductInfo(JSONArray productIDs, String type, CallbackContext callbackContext) {
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
                    cacheProduct(detail);
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
    private void makePurchase(String productIdentifier, @Nullable String oldSku, String type,
                              CallbackContext callbackContext) {
        final Activity currentActivity = this.cordova.getActivity();
        if (currentActivity != null) {
            if (products.isEmpty()) {
                Purchases.getSharedInstance().getEntitlements(new ReceiveEntitlementsListener() {
                    @Override
                    public void onReceived(@NonNull Map<String, Entitlement> entitlementMap) {
                        mapEntitlementsAndCacheProducts(entitlementMap);
                        makePurchase(currentActivity, oldSku, type, productIdentifier, callbackContext);
                    }

                    @Override
                    public void onError(@NonNull PurchasesError error) {
                        onMakePurchaseError(error, false, callbackContext);
                    }
                });
            } else {
                makePurchase(currentActivity, oldSku, type, productIdentifier, callbackContext);
            }
        } else {
            onMakePurchaseError(new PurchasesError(PurchasesErrorCode.PurchaseInvalidError, "There is no current Activity"), false, callbackContext);
        }
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "syncPurchases")
    public void syncPurchases(CallbackContext callbackContext) {
        Purchases.getSharedInstance().syncPurchases();
    }

    private void makePurchase(final Activity currentActivity, final String oldSku, final String type,
                              final String productIdentifier, final CallbackContext callbackContext) {
        Map<String, SkuDetails> typeMap = products.get(type);
        SkuDetails productToBuy = null;
        if (typeMap != null) {
            productToBuy = typeMap.get(productIdentifier);
        }
        if (productToBuy != null) {
            MakePurchaseListener listener = new MakePurchaseListener() {
                @Override
                public void onCompleted(@NonNull Purchase purchase, @NonNull PurchaserInfo purchaserInfo) {
                    JSONObject object = new JSONObject();
                    try {
                        object.put("productIdentifier", purchase.getSku());
                        object.put("purchaserInfo", mapPurchaserIfo(purchaserInfo));
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    callbackContext.success(object);
                }

                @Override
                public void onError(@NonNull PurchasesError error, Boolean userCancelled) {
                    onMakePurchaseError(error, userCancelled, callbackContext);
                }
            };
            if (oldSku == null || oldSku.isEmpty()) {
                Purchases.getSharedInstance().makePurchase(currentActivity, productToBuy, listener);
            } else {
                Purchases.getSharedInstance().makePurchase(currentActivity, productToBuy, oldSku, listener);
            }
        } else {
            onMakePurchaseError(new PurchasesError(PurchasesErrorCode.ProductNotAvailableForPurchaseError,
                    "Couldn't find product."), false, callbackContext);
        }
    }

    private void onMakePurchaseError(@NonNull PurchasesError error, Boolean userCancelled, CallbackContext callbackContext) {
        JSONObject object = new JSONObject();
        try {
            object.put("error", mapError(error));
            object.put("userCancelled", userCancelled);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        callbackContext.error(object);
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "getAppUserID", isAutofinish = false)
    private void getAppUserID(CallbackContext callbackContext) {
        callbackContext.success(Purchases.getSharedInstance().getAppUserID());
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "restoreTransactions", isAutofinish = false)
    private void restoreTransactions(CallbackContext callbackContext) {
        Purchases.getSharedInstance().restorePurchases(getReceivePurchaserInfoListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "reset", isAutofinish = false)
    private void reset(CallbackContext callbackContext) {
        Purchases.getSharedInstance().reset(getReceivePurchaserInfoListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "identify", isAutofinish = false)
    private void identify(String appUserID, CallbackContext callbackContext) {
        Purchases.getSharedInstance().identify(appUserID, getReceivePurchaserInfoListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "createAlias", isAutofinish = false)
    private void createAlias(String newAppUserID, CallbackContext callbackContext) {
        Purchases.getSharedInstance().createAlias(newAppUserID, getReceivePurchaserInfoListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "getPurchaserInfo", isAutofinish = false)
    private void getPurchaserInfo(CallbackContext callbackContext) {
        Purchases.getSharedInstance().getPurchaserInfo(getReceivePurchaserInfoListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setDebugLogsEnabled")
    private void setDebugLogsEnabled(boolean enabled, CallbackContext callbackContext) {
        Purchases.setDebugLogsEnabled(enabled);
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setAutomaticAppleSearchAdsAttributionCollection")
    private void setAutomaticAppleSearchAdsAttributionCollection(boolean enabled, CallbackContext callbackContext) {
        // NOOP
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

            Mappers.putNullableDate(map, "latestExpirationDate", purchaserInfo.getLatestExpirationDate());

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
                Mappers.putNullableDate(allEntitlementExpirationDates, entitlementId, date);
            }
            map.put("expirationsForActiveEntitlements", allEntitlementExpirationDates);

            JSONObject purchaseDatesForActiveEntitlements = new JSONObject();
            for (String entitlementId : purchaserInfo.getActiveEntitlements()) {
                Date date = purchaserInfo.getPurchaseDateForEntitlement(entitlementId);
                Mappers.putNullableDate(purchaseDatesForActiveEntitlements, entitlementId, date);
            }
            map.put("purchaseDatesForActiveEntitlements", purchaseDatesForActiveEntitlements);

            map.put("entitlements", Mappers.map(purchaserInfo.getEntitlements()));
            map.put("firstSeen", Iso8601Utils.format(purchaserInfo.getFirstSeen()));
            map.put("originalAppUserId",purchaserInfo.getOriginalAppUserId());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return map;
    }

    private JSONObject mapError(PurchasesError purchasesError) {
        JSONObject object = new JSONObject();
        try {
            object.put("message", purchasesError.getMessage());
            object.put("code", purchasesError.getCode().ordinal());
            object.put("readable_error_code", purchasesError.getCode().name());
            object.put("underlyingErrorMessage", purchasesError.getUnderlyingErrorMessage());
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
            putIntroPrice(detail, map);
            map.put("currency_code", detail.getPriceCurrencyCode());
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return map;
    }

    private void putIntroPrice(SkuDetails detail, JSONObject map) throws JSONException {
        if (detail.getFreeTrialPeriod().isEmpty()) {
            String introductoryPriceAmountMicros = detail.getIntroductoryPriceAmountMicros();
            if (introductoryPriceAmountMicros != null && !introductoryPriceAmountMicros.isEmpty()) {
                map.put("intro_price", String.valueOf(Long.parseLong(introductoryPriceAmountMicros) / 1000000d));
            } else {
                map.put("intro_price", "");
            }
            map.put("intro_price_string", detail.getIntroductoryPrice());
            map.put("intro_price_period", detail.getIntroductoryPricePeriod());
            if (detail.getIntroductoryPricePeriod() != null && !detail.getIntroductoryPricePeriod().isEmpty()) {
                PurchasesPeriod period = PurchasesPeriod.parse(detail.getIntroductoryPricePeriod());
                if (period.years > 0) {
                    map.put("intro_price_period_unit", "YEAR");
                    map.put("intro_price_period_number_of_units", "" + period.years);
                } else if (period.months > 0) {
                    map.put("intro_price_period_unit", "MONTH");
                    map.put("intro_price_period_number_of_units", "" + period.months);
                } else if (period.days > 0) {
                    map.put("intro_price_period_unit", "DAY");
                    map.put("intro_price_period_number_of_units", "" + period.days);
                }
            } else {
                map.put("intro_price_period_unit", "");
                map.put("intro_price_period_number_of_units", "");
            }
            map.put("intro_price_cycles", detail.getIntroductoryPriceCycles());
        } else {
            map.put("intro_price", "0");
            // Format using device locale. iOS will format using App Store locale, but there's no way
            // to figure out how the price in the SKUDetails is being formatted.
            NumberFormat format = NumberFormat.getCurrencyInstance();
            format.setCurrency(Currency.getInstance(detail.getPriceCurrencyCode()));
            map.put("intro_price_string", format.format(0));
            map.put("intro_price_period", detail.getFreeTrialPeriod());
            PurchasesPeriod period = PurchasesPeriod.parse(detail.getIntroductoryPricePeriod());
            if (period.years > 0) {
                map.put("intro_price_period_unit", "YEAR");
                map.put("intro_price_period_number_of_units", "" + period.years);
            } else if (period.months > 0) {
                map.put("intro_price_period_unit", "MONTH");
                map.put("intro_price_period_number_of_units", "" + period.months);
            } else if (period.days > 0) {
                map.put("intro_price_period_unit", "DAY");
                map.put("intro_price_period_number_of_units", "" + period.days);
            }
            map.put("intro_price_cycles", "1");
        }
    }

    private void cacheProduct(SkuDetails detail) {
        Map<String, SkuDetails> typeMap = products.get(detail.getType());
        if (typeMap == null) {
            typeMap = new HashMap<>();
        }
        typeMap.put(detail.getSku(), detail);
        products.put(detail.getType(), typeMap);
    }
}

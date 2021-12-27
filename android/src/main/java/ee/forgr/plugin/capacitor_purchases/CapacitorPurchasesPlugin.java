package ee.forgr.plugin.capacitor_purchases;

import androidx.annotation.NonNull;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.PluginResult;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.revenuecat.purchases.PurchaserInfo;
import com.revenuecat.purchases.Purchases;

import androidx.annotation.Nullable;

import com.revenuecat.purchases.hybridcommon.CommonKt;
import com.revenuecat.purchases.hybridcommon.ErrorContainer;
import com.revenuecat.purchases.hybridcommon.OnResult;
import com.revenuecat.purchases.hybridcommon.OnResultList;
import com.revenuecat.purchases.hybridcommon.OnResultAny;
import com.revenuecat.purchases.common.PlatformInfo;
import com.revenuecat.purchases.hybridcommon.SubscriberAttributesKt;
import com.revenuecat.purchases.hybridcommon.mappers.PurchaserInfoMapperKt;
import com.revenuecat.purchases.interfaces.UpdatedPurchaserInfoListener;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@CapacitorPlugin(name = "CapacitorPurchases")
public class CapacitorPurchasesPlugin extends Plugin {

    public static final String PLATFORM_NAME = "capacitor";
    public static final String PLUGIN_VERSION = "2.4.0";

    @PluginMethod
    private void setup(PluginCall call) {
        String apiKey = call.getString("apiKey");
        String appUserID = call.getString("appUserID");
        PlatformInfo platformInfo = new PlatformInfo(PLATFORM_NAME, PLUGIN_VERSION);
        CommonKt.configure(this.bridge.getActivity(), apiKey, appUserID, true, platformInfo);
        Purchases.getSharedInstance().setUpdatedPurchaserInfoListener(new UpdatedPurchaserInfoListener() {
            @Override
            public void onReceived(@NonNull PurchaserInfo purchaserInfo) {
                JSObject ret = new JSObject();
                ret.put("purchases", convertMapToJson(new HashMap<String, String>()));
                ret.put("purchaserInfo", convertMapToJson(PurchaserInfoMapperKt.map(purchaserInfo)));
                notifyListeners("purchasesUpdate", ret);
            }
        });
    }

    // @PluginMethod
    // public void addAttributionData(PluginCall call) {
    //     String networkUserId = call.getString("networkUserId");
    //     Integer network = call.getInt("networkUserId");
    //     JSONObject data = call.getObject("data");

    //     SubscriberAttributesKt.addAttributionData(data, network, networkUserId);
    //     call.resolve();
    // }

    @PluginMethod
    private void getOfferings(PluginCall call) {
        CommonKt.getOfferings(getOnResult(call));
    }

//    @PluginMethod
//    private void getProductInfo(PluginCall call) {
//        JSONArray productIDs = call.getArray("productIDs");
//        String type = call.getString("type");
//        List<String> productIDList = new ArrayList<>();
//        for (int i = 0; i < productIDs.length(); i++) {
//            try {
//                productIDList.add(productIDs.getString(i));
//            } catch (JSONException e) {
//                e.printStackTrace();
//            }
//        }
//        CommonKt.getProductInfo(productIDList, type, new OnResultList() {
//            @Override
//            public void onReceived(List<Map<String, ?>> map) {
//                JSONArray writableArray = new JSONArray();
//                JSObject ret = new JSObject();
//                for (Map<String, ?> detail : map) {
//                    writableArray.put(convertMapToJson(detail));
//                }
//                ret.put("products", writableArray);
//                call.resolve(ret);
//            }
//
//            @Override
//            public void onError(ErrorContainer errorContainer) {
//                call.resolve(convertMapToJson(errorContainer.getInfo()));
//
//            }
//        });
//    }

    // @PluginMethod
    // private void purchaseProduct(PluginCall call) {
    //     String identifier = call.getString("identifier");
    //     String type = call.getString("type");
    //     CommonKt.purchaseProduct(
    //             this.bridge.getActivity(),
    //             identifier,
    //             null,
    //             null,
    //             type,
    //             getOnResult(call));
    // }

    @PluginMethod
    private void purchasePackage(PluginCall call) {
        String identifier = call.getString("identifier");
        String offeringIdentifier = call.getString("offeringIdentifier");
        if(identifier == "" || offeringIdentifier == "") {
            call.reject("No package provided");
            return;
        }
        CommonKt.purchasePackage(
                this.bridge.getActivity(),
                identifier,
                offeringIdentifier,
                null,
                null,
                getOnResult(call));
    }

    // @PluginMethod
    // public void syncPurchases(PluginCall call) {
    //     CommonKt.syncPurchases();
    //     call.resolve();
    // }

    // @PluginMethod
    // private void getAppUserID(PluginCall call) {
    //     JSObject ret = new JSObject();
    //     ret.put("userId", CommonKt.getAppUserID());
    //     call.resolve(ret);
    // }

    @PluginMethod
    private void restoreTransactions(PluginCall call) {
        CommonKt.restoreTransactions(getOnResult(call));
    }

    @PluginMethod
    private void logIn(PluginCall call) {
        String appUserID = call.getString("appUserID");
        CommonKt.logIn(appUserID, getOnResult(call));
    }

    @PluginMethod
    private void logOut(PluginCall call) {
        CommonKt.logOut(getOnResult(call));
    }

    @PluginMethod
    private void getPurchaserInfo(PluginCall call) {
        CommonKt.getPurchaserInfo(getOnResult(call));
    }

    @PluginMethod
    private void setDebugLogsEnabled(PluginCall call) {
        boolean enabled = call.getBoolean("enabled");
        CommonKt.setDebugLogsEnabled(enabled);
        call.resolve();
    }

//     @PluginMethod
//     private void isAnonymous(PluginCall call) {
//         JSObject ret = new JSObject();
//         ret.put("isAnonymous", CommonKt.isAnonymous());
//         call.resolve(ret);
//     }

//     @PluginMethod
//     private void invalidatePurchaserInfoCache(PluginCall call) {
//         CommonKt.invalidatePurchaserInfoCache();
//         call.resolve();
//     }

//     @PluginMethod
//     public void setProxyURLString(PluginCall call) {
//         String proxyURLString = call.getString("proxyURLString");
//         CommonKt.setProxyURLString(proxyURLString);
//         call.resolve();
//     }

//    @PluginMethod
//     private void canMakePayments(PluginCall call) {
//         JSONArray features = call.getArray("features");
//         ArrayList<Integer> featureList = new ArrayList<>();
//         try {
//             if (features != null) {
//                 for (int i = 0; i < features.length(); i++) {
//                     featureList.add(features.getInt(i));
//                 }
//             }
//         } catch (JSONException e) {
//             e.printStackTrace();
//         }

//         CommonKt.canMakePayments(this.bridge.getActivity(), featureList, new OnResultAny<Boolean>() {
//             @Override
//             public void onError(@Nullable ErrorContainer errorContainer) {
//                 call.resolve(convertMapToJson(errorContainer.getInfo()));
//             }

//             @Override
//             public void onReceived(Boolean result) {
//                 JSObject ret = new JSObject();
//                 ret.put("canMakePayments", result);
//                 call.resolve(ret);
//             }
//         });
//     }

//     //================================================================================
//     // Subscriber Attributes
//     //================================================================================

//     @PluginMethod
//     private void setAttributes(PluginCall call) throws JSONException {
//         JSONObject attributes = call.getObject("attributes");
//         SubscriberAttributesKt.setAttributes(convertJsonToMap(attributes));
//         call.resolve();
//     }

//     @PluginMethod
//     private void setEmail(PluginCall call) {
//         String email = call.getString("email");
//         SubscriberAttributesKt.setEmail(email);
//         call.resolve();
//     }

//     @PluginMethod
//     private void setPhoneNumber(PluginCall call) {
//         String phoneNumber = call.getString("phoneNumber");
//         SubscriberAttributesKt.setPhoneNumber(phoneNumber);
//         call.resolve();
//     }

//     @PluginMethod
//     private void setDisplayName(PluginCall call) {
//         String displayName = call.getString("displayName");
//         SubscriberAttributesKt.setDisplayName(displayName);
//         call.resolve();
//     }

//     @PluginMethod
//     private void setPushToken(PluginCall call) {
//         String pushToken = call.getString("pushToken");
//         SubscriberAttributesKt.setPushToken(pushToken);
//         call.resolve();
//     }

//     @PluginMethod
//     private void setAdjustID(PluginCall call) {
//         String adjustID = call.getString("adjustID");
//         SubscriberAttributesKt.setAdjustID(adjustID);
//         call.resolve();
//     }

//     @PluginMethod
//     private void setAppsflyerID(PluginCall call) {
//         String appsflyerID = call.getString("appsflyerID");
//         SubscriberAttributesKt.setAppsflyerID(appsflyerID);
//         call.resolve();
//     }

//     @PluginMethod
//     private void setFBAnonymousID(PluginCall call) {
//         String fBAnonymousID = call.getString("fBAnonymousID");
//         SubscriberAttributesKt.setFBAnonymousID(fBAnonymousID);
//         call.resolve();
//     }

//     @PluginMethod
//     private void setMparticleID(PluginCall call) {
//         String mparticleID = call.getString("mparticleID");
//         SubscriberAttributesKt.setMparticleID(mparticleID);
//         call.resolve();
//     }

//     @PluginMethod
//     private void setOnesignalID(PluginCall call) {
//         String onesignalID = call.getString("onesignalID");
//         SubscriberAttributesKt.setOnesignalID(onesignalID);
//         call.resolve();
//     }

//     @PluginMethod
//     private void setAirshipChannelID(PluginCall call) {
//         String airshipChannelID = call.getString("airshipChannelID");
//         SubscriberAttributesKt.setAirshipChannelID(airshipChannelID);
//         call.resolve();
//     }

//     @PluginMethod
//     private void setMediaSource(PluginCall call) {
//         String mediaSource = call.getString("mediaSource");
//         SubscriberAttributesKt.setMediaSource(mediaSource);
//         call.resolve();
//     }

//     @PluginMethod
//     private void setCampaign(PluginCall call) {
//         String campaign = call.getString("campaign");
//         SubscriberAttributesKt.setCampaign(campaign);
//         call.resolve();
//     }

//     @PluginMethod
//     private void setAdGroup(PluginCall call) {
//         String adGroup = call.getString("adGroup");
//         SubscriberAttributesKt.setAdGroup(adGroup);
//         call.resolve();
//     }

//    @PluginMethod
//     private void setAd(PluginCall call) {
//         String ad = call.getString("ad");
//         SubscriberAttributesKt.setAd(ad);
//         call.resolve();
//     }

//     @PluginMethod
//     private void setKeyword(PluginCall call) {
//         String keyword = call.getString("keyword");
//         SubscriberAttributesKt.setKeyword(keyword);
//         call.resolve();
//     }

//     @PluginMethod
//     private void setCreative(PluginCall call) {
//         String creative = call.getString("creative");
//         SubscriberAttributesKt.setCreative(creative);
//         call.resolve();
//     }

//     @PluginMethod
//     private void collectDeviceIdentifiers(PluginCall call) {
//         SubscriberAttributesKt.collectDeviceIdentifiers();
//         call.resolve();
//     }

//     @PluginMethod
//     private void presentCodeRedemptionSheet(PluginCall call) {
//         call.resolve();
//     }

    //================================================================================
    // Private methods
    //================================================================================

    private OnResult getOnResult(PluginCall call) {
        return new OnResult() {
            @Override
            public void onReceived(Map<String, ?> map) {
                call.resolve(convertMapToJson(map));
            }

            @Override
            public void onError(ErrorContainer errorContainer) {
                call.resolve(convertMapToJson(errorContainer.getInfo()));
            }
        };
    }

//    private static Map<String, String> convertJsonToMap(JSONObject jsonObject) {
//        HashMap map = new HashMap();
//        Iterator keys = jsonObject.keys();
//        while (keys.hasNext()) {
//            String key = (String) keys.next();
//            try {
//                map.put(key, jsonObject.get(key));
//            } catch (JSONException e) {
//                e.printStackTrace();
//            }
//        }
//        return map;
//    }

    private static JSObject convertMapToJson(Map<String, ?> readableMap) {
        JSObject object = new JSObject();

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
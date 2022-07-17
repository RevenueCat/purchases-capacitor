package ee.forgr.plugin.capacitor_purchases;

import android.util.Log;

import androidx.annotation.NonNull;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.google.common.base.CaseFormat;
import com.revenuecat.purchases.PurchaserInfo;
import com.revenuecat.purchases.Purchases;

import com.revenuecat.purchases.hybridcommon.CommonKt;
import com.revenuecat.purchases.hybridcommon.ErrorContainer;
import com.revenuecat.purchases.hybridcommon.OnResult;
import com.revenuecat.purchases.common.PlatformInfo;
import com.revenuecat.purchases.hybridcommon.mappers.PurchaserInfoMapperKt;
import com.revenuecat.purchases.interfaces.UpdatedPurchaserInfoListener;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CapacitorPlugin(name = "CapacitorPurchases")
public class CapacitorPurchasesPlugin extends Plugin {

    public static final String PLATFORM_NAME = "capacitor";
    public static final String PLUGIN_VERSION = "2.4.0";

    @PluginMethod
    public void setup(PluginCall call) {
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

    @PluginMethod
    public void getOfferings(PluginCall call) {
        CommonKt.getOfferings(getOnResult(call, "offerings"));
    }

    @PluginMethod
    public void purchasePackage(PluginCall call) {
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
                getOnResult(call, ""));
    }

    @PluginMethod
    public void restoreTransactions(PluginCall call) {
        CommonKt.restoreTransactions(getOnResult(call, "purchaserInfo"));
    }

    @PluginMethod
    public void logIn(PluginCall call) {
        String appUserID = call.getString("appUserID");
        CommonKt.logIn(appUserID, getOnResult(call, ""));
    }

    @PluginMethod
    public void logOut(PluginCall call) {
        CommonKt.logOut(getOnResult(call, "purchaserInfo"));
    }

    @PluginMethod
    public void getPurchaserInfo(PluginCall call) {
        CommonKt.getPurchaserInfo(getOnResult(call, "purchaserInfo"));
    }

    @PluginMethod
    public void setDebugLogsEnabled(PluginCall call) {
        boolean enabled = call.getBoolean("enabled");
        CommonKt.setDebugLogsEnabled(enabled);
        call.resolve();
    }

    //================================================================================
    // Private methods
    //================================================================================

    private OnResult getOnResult(PluginCall call, String name) {
        return new OnResult() {
            @Override
            public void onReceived(Map<String, ?> map) {
                if (name.equals("")) {
                    call.resolve(convertMapToJson(map));
                    return;
                }
                JSObject ret = new JSObject();
                ret.put(name, convertMapToJson(map));
                call.resolve(ret);
            }

            @Override
            public void onError(ErrorContainer errorContainer) {
                JSObject object = convertMapToJson(errorContainer.getInfo());
                Log.e("Purchases", "Error  \"" + object);
                call.reject(object.getString("message"));
            }
        };
    }

    private static JSObject convertMapToJson(Map<String, ?> readableMap) {
        JSObject object = new JSObject();

        for (Map.Entry<String, ?> entry : readableMap.entrySet()) {
            String camelKey = entry.getKey().contains("_") ? CaseFormat.LOWER_UNDERSCORE.to(CaseFormat.LOWER_CAMEL, entry.getKey()) : entry.getKey();
            if (entry.getValue() == null) {
                object.put(camelKey, JSONObject.NULL);
            } else if (entry.getValue() instanceof Map) {
                object.put(camelKey, convertMapToJson((Map<String, Object>) entry.getValue()));
            } else if (entry.getValue() instanceof Object[]) {
                object.put(camelKey, convertArrayToJsonArray((Object[]) entry.getValue()));
            } else if (entry.getValue() instanceof List) {
                object.put(camelKey, convertArrayToJsonArray(((List) entry.getValue()).toArray()));
            } else if (entry.getValue() != null) {
                Object value = entry.getValue();
                if (camelKey == "priceString") {
                    String currency_symbol = ((String) value).replaceAll("\\d","").replace(".","").replace(",","");
                    object.put("currencySymbol", currency_symbol);
                }
                if (camelKey == "title") {
                    // value = ((String) value).replace("(" + AppName + ")", "");
                    value = ((String) value).replaceAll("\\((.*?)\\)", ""); // TODO find better implementation
                }
                object.put(camelKey, value);
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
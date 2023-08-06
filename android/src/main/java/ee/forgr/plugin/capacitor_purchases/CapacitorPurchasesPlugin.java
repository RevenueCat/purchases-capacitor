package ee.forgr.plugin.capacitor_purchases;

import android.util.Log;
import androidx.annotation.NonNull;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.common.base.CaseFormat;
import com.revenuecat.purchases.CustomerInfo;
import com.revenuecat.purchases.Purchases;
import com.revenuecat.purchases.common.PlatformInfo;
import com.revenuecat.purchases.hybridcommon.CommonKt;
import com.revenuecat.purchases.hybridcommon.ErrorContainer;
import com.revenuecat.purchases.hybridcommon.OnResult;
import com.revenuecat.purchases.hybridcommon.mappers.CustomerInfoMapperKt;
import com.revenuecat.purchases.interfaces.UpdatedCustomerInfoListener;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

@CapacitorPlugin(name = "CapacitorPurchases")
public class CapacitorPurchasesPlugin extends Plugin {

  public static final String PLATFORM_NAME = "capacitor";
  public final String PLUGIN_VERSION = "2.0.13";

  @PluginMethod
  public void setup(PluginCall call) {
    String apiKey = call.getString("apiKey");
    String appUserID = call.getString("appUserID");
    Boolean observerMode = call.getBoolean("observerMode", false);
    PlatformInfo platformInfo = new PlatformInfo(PLATFORM_NAME, PLUGIN_VERSION);
    CommonKt.configure(
      this.bridge.getActivity(),
      apiKey,
      appUserID,
      observerMode,
      platformInfo
    );
    if (call.getBoolean("collectDeviceIdentifiers", false)) {
      Purchases.getSharedInstance().collectDeviceIdentifiers();
    }
    Purchases
      .getSharedInstance()
      .setUpdatedCustomerInfoListener(
        new UpdatedCustomerInfoListener() {
          @Override
          public void onReceived(@NonNull CustomerInfo customerInfo) {
            JSObject ret = new JSObject();
            ret.put(
              "purchases",
              convertMapToJson(new HashMap<String, String>())
            );
            ret.put(
              "customerInfo",
              convertMapToJson(CustomerInfoMapperKt.map(customerInfo))
            );
            notifyListeners("purchasesUpdate", ret);
          }
        }
      );
    call.resolve();
  }

  @PluginMethod
  public void getOfferings(PluginCall call) {
    CommonKt.getOfferings(getOnResult(call, "offerings"));
  }

  @PluginMethod
  public void purchasePackage(PluginCall call) {
    String identifier = call.getString("identifier");
    String oldSKU = call.getString("oldSKU", null);
    String offeringIdentifier = call.getString("offeringIdentifier");
    if (identifier == "" || offeringIdentifier == "") {
      call.reject("No package provided");
      return;
    }
    CommonKt.purchasePackage(
      this.bridge.getActivity(),
      identifier,
      offeringIdentifier,
      oldSKU,
      null,
      false,
      getOnResult(call, "")
    );
  }

  @PluginMethod
  public void restorePurchases(PluginCall call) {
    CommonKt.restorePurchases(getOnResult(call, "customerInfo"));
  }

  @PluginMethod
  public void setAttributes(PluginCall call) throws JSONException {
    JSObject attributes = call.getObject("attributes", new JSObject());
    Purchases.getSharedInstance().setAttributes(convertJsonToMap(attributes));
    call.resolve();
  }

  public static Map<String, String> convertJsonToMap(JSONObject jsonobj)
    throws JSONException {
    Map<String, String> map = new HashMap<String, String>();
    Iterator<String> keys = jsonobj.keys();
    while (keys.hasNext()) {
      String key = keys.next();
      String value = jsonobj.getString(key);
      map.put(key, value);
    }
    return map;
  }

  @PluginMethod
  public void logIn(PluginCall call) {
    String appUserID = call.getString("appUserID");
    CommonKt.logIn(appUserID, getOnResult(call, ""));
  }

  @PluginMethod
  public void logOut(PluginCall call) {
    CommonKt.logOut(getOnResult(call, "customerInfo"));
  }

  @PluginMethod
  public void getCustomerInfo(PluginCall call) {
    CommonKt.getCustomerInfo(getOnResult(call, "customerInfo"));
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
      String camelKey = entry.getKey().contains("_")
        ? CaseFormat.LOWER_UNDERSCORE.to(CaseFormat.LOWER_CAMEL, entry.getKey())
        : entry.getKey();
      if (entry.getValue() == null) {
        object.put(camelKey, JSONObject.NULL);
      } else if (entry.getValue() instanceof Map) {
        object.put(
          camelKey,
          convertMapToJson((Map<String, Object>) entry.getValue())
        );
      } else if (entry.getValue() instanceof Object[]) {
        object.put(
          camelKey,
          convertArrayToJsonArray((Object[]) entry.getValue())
        );
      } else if (entry.getValue() instanceof List) {
        object.put(
          camelKey,
          convertArrayToJsonArray(((List) entry.getValue()).toArray())
        );
      } else if (entry.getValue() != null) {
        Object value = entry.getValue();
        if (camelKey == "priceString") {
          String currency_symbol =
            ((String) value).replaceAll("\\d", "")
              .replace(".", "")
              .replace(",", "");
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

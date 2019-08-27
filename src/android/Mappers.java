package com.revenuecat.purchases;

import com.revenuecat.purchases.util.Iso8601Utils;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Date;
import java.util.Map;

class Mappers {

     static JSONObject map(EntitlementInfos data) throws JSONException {
         JSONObject entitlementInfos = new JSONObject();
         JSONObject all = new JSONObject();
         for (Map.Entry<String, EntitlementInfo> entry : data.getAll().entrySet()) {
             all.put(entry.getKey(), Mappers.map(entry.getValue()));
         }
         entitlementInfos.put("all", all);
         JSONObject active = new JSONObject();
         for (Map.Entry<String, EntitlementInfo> entry : data.getActive().entrySet()) {
             active.put(entry.getKey(), Mappers.map(entry.getValue()));
         }
         entitlementInfos.put("active", active);

         return entitlementInfos;
     }

     private static JSONObject map(EntitlementInfo data) throws JSONException {
         JSONObject entitlementInfo = new JSONObject();
         entitlementInfo.put("identifier", data.getIdentifier());
         entitlementInfo.put("isActive", data.isActive());
         entitlementInfo.put("willRenew", data.getWillRenew());
         entitlementInfo.put("periodType", data.getPeriodType().name());
         entitlementInfo.put("latestPurchaseDate", Iso8601Utils.format(data.getLatestPurchaseDate()));
         entitlementInfo.put("originalPurchaseDate", Iso8601Utils.format(data.getOriginalPurchaseDate()));
         putNullableDate(entitlementInfo, "expirationDate", data.getExpirationDate());
         entitlementInfo.put("store", data.getStore().name());
         entitlementInfo.put("productIdentifier", data.getProductIdentifier());
         entitlementInfo.put("isSandbox", data.isSandbox());
         putNullableDate(entitlementInfo, "unsubscribeDetectedAt", data.getUnsubscribeDetectedAt());
         putNullableDate(entitlementInfo, "billingIssueDetectedAt", data.getBillingIssueDetectedAt());
         return entitlementInfo;
     }

     static void putNullableDate(JSONObject map, String key, Date date) throws JSONException {
         if (date != null) {
             map.put(key, Iso8601Utils.format(date));
         } else {
             map.put(key, JSONObject.NULL);
         }
     }
}
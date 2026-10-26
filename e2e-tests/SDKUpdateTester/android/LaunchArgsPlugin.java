// Created by Antonio Pallares. Copyright (c) 2026 RevenueCat, Inc.
package com.revenuecat.SDKUpdateTester;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "LaunchArgs")
public class LaunchArgsPlugin extends Plugin {

    @PluginMethod
    public void getLaunchArguments(PluginCall call) {
        JSObject result = new JSObject();
        result.put("appUserID", getActivity().getIntent().getStringExtra("app_user_id_to_log_in"));
        call.resolve(result);
    }
}

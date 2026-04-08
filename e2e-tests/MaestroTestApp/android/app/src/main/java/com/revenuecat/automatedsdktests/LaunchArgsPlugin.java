package com.revenuecat.automatedsdktests;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "LaunchArgs")
public class LaunchArgsPlugin extends Plugin {
    @PluginMethod
    public void getTestFlow(PluginCall call) {
        String testFlow = getActivity().getIntent().getStringExtra("e2e_test_flow");
        JSObject ret = new JSObject();
        ret.put("value", testFlow);
        call.resolve(ret);
    }
}

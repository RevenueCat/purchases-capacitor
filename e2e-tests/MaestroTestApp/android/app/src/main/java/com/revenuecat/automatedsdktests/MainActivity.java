package com.revenuecat.automatedsdktests;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugin(LaunchArgsPlugin.class);
        super.onCreate(savedInstanceState);
    }
}

package com.revenuecat.automatedsdktests;

import android.content.Intent;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugin(LaunchArgsPlugin.class);
        super.onCreate(savedInstanceState);
    }

    // MainActivity is declared as singleTask, so subsequent launches arrive via onNewIntent
    // instead of recreating the activity. Update the stored intent so LaunchArgsPlugin reads
    // the latest extras (e.g. a new e2e_test_flow value) on relaunch.
    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
    }
}

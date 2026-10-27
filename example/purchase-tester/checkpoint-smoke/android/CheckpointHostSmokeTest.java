package com.revenuecat.capacitor.checkpointsmoke;

import android.content.Context;
import android.content.Intent;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.uiautomator.By;
import androidx.test.uiautomator.UiDevice;
import androidx.test.uiautomator.UiObject2;
import androidx.test.uiautomator.Until;
import java.util.regex.Pattern;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.junit.Assert.*;

@RunWith(AndroidJUnit4.class)
public class CheckpointHostSmokeTest {
    @Test public void DOMErrorAppearsAboveNativeModalAndRestoresWebView() throws Exception {
        Context context = InstrumentationRegistry.getInstrumentation().getTargetContext();
        Intent intent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        context.startActivity(intent);
        UiDevice device = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());
        UiObject2 checkpoints = device.wait(Until.findObject(By.text(Pattern.compile("Checkpoints", Pattern.CASE_INSENSITIVE))), 20000);
        assertNotNull("Checkpoint navigation missing", checkpoints);
        checkpoints.click();
        UiObject2 run = device.wait(Until.findObject(By.text(Pattern.compile("Run checkpoint", Pattern.CASE_INSENSITIVE))), 10000);
        assertNotNull("Run button missing", run);
        run.click();
        assertNotNull("Native setup rejection missing", device.wait(Until.findObject(By.textContains("Configure Purchases before calling a checkpoint")), 10000));
        for (int iteration = 1; iteration <= 3; iteration++) {
            UiObject2 probe = device.wait(Until.findObject(By.text(Pattern.compile("Test error host \\(synthetic modal\\)", Pattern.CASE_INSENSITIVE))), 10000);
            assertNotNull("Probe button missing", probe);
            probe.click();
            assertNotNull("DOM error not visible above native modal", device.wait(Until.findObject(By.text("App-owned DOM error")), 10000));
            device.executeShellCommand("screencap -p /sdcard/Download/android-custom-dom-error-" + iteration + ".png");
            UiObject2 acknowledge = device.wait(Until.findObject(By.text("Acknowledge error")), 5000);
            assertNotNull("DOM acknowledgement missing", acknowledge);
            acknowledge.click();
            assertTrue("DOM error stayed open", device.wait(Until.gone(By.text("App-owned DOM error")), 10000));
        }
        device.executeShellCommand("screencap -p /sdcard/Download/android-restored-webview.png");
    }
}

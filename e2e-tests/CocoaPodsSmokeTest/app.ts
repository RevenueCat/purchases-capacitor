import { Capacitor } from '@capacitor/core';
import { Purchases } from '@revenuecat/purchases-capacitor';
import { RevenueCatUI } from '@revenuecat/purchases-capacitor-ui';

const root = document.getElementById('app')!;

async function run(): Promise<void> {
  const appUserID = 'git-cocoapods-smoke-test';
  await Purchases.configure({ apiKey: 'appl_cocoapods_smoke_test', appUserID });
  const result = await Purchases.getAppUserID();
  if (result.appUserID !== appUserID) {
    throw new Error('The native bridge returned the wrong app user ID');
  }
  if (typeof RevenueCatUI.presentPaywall !== 'function' || !Capacitor.isPluginAvailable('RevenueCatUI')) {
    throw new Error('The UI plugin is not registered');
  }
  root.textContent = 'COCOAPODS_SMOKE_PASSED';
}

void run().catch((error: Error) => {
  root.textContent = `COCOAPODS_SMOKE_FAILED: ${error.message}`;
});

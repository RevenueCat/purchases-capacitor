import { registerPlugin } from '@capacitor/core';
import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { RevenueCatUI } from '@revenuecat/purchases-capacitor-ui';

const API_KEY = 'MAESTRO_TESTS_REVENUECAT_API_KEY';

interface LaunchArgsPlugin {
  getTestFlow(): Promise<{ value: string | null }>;
}

const LaunchArgs = registerPlugin<LaunchArgsPlugin>('LaunchArgs');

const TEST_FLOW_SCREEN_MAP: Record<string, () => void> = {
  purchase_through_paywall: () => showPurchaseScreen(),
};

let hasProEntitlement: boolean | null = null;

function entitlementsText(): string {
  if (hasProEntitlement === null) return 'Entitlements: loading';
  return `Entitlements: ${hasProEntitlement ? 'pro' : 'none'}`;
}

function updateEntitlementsLabel() {
  const label = document.getElementById('entitlements-label');
  if (label) label.textContent = entitlementsText();
}

function showError(message: string) {
  let el = document.getElementById('error-message');
  if (!el) {
    el = document.createElement('p');
    el.id = 'error-message';
    el.style.color = 'red';
    el.style.fontSize = '14px';
    document.getElementById('app')?.appendChild(el);
  }
  el.textContent = `Error: ${message}`;
}

function clearError() {
  const el = document.getElementById('error-message');
  if (el) el.remove();
}

async function init() {
  try {
    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
    await Purchases.configure({ apiKey: API_KEY });

    await Purchases.addCustomerInfoUpdateListener((info) => {
      hasProEntitlement = info.entitlements.active['pro'] !== undefined;
      updateEntitlementsLabel();
    });

    let testFlow: string | null = null;
    try {
      const result = await LaunchArgs.getTestFlow();
      testFlow = result.value;
    } catch (_) {
      /* launch args not available */
    }

    const navigateFn = testFlow ? TEST_FLOW_SCREEN_MAP[testFlow] : null;
    if (navigateFn) {
      navigateFn();
    } else {
      showTestCases();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Failed to initialize:', message);
    showTestCases();
    showError(message);
  }
}

function showTestCases() {
  document.getElementById('app')!.innerHTML = `
    <h1>Test Cases</h1>
    <button id="purchase-btn">Purchase through paywall</button>
  `;
  document.getElementById('purchase-btn')!.addEventListener('click', showPurchaseScreen);
}

async function showPurchaseScreen() {
  document.getElementById('app')!.innerHTML = `
    <div class="center">
      <p id="entitlements-label">${entitlementsText()}</p>
      <button id="paywall-btn">Present Paywall</button>
      <button id="back-btn" style="background-color: #888; margin-top: 16px;">Back</button>
    </div>
  `;

  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    hasProEntitlement = customerInfo.entitlements.active['pro'] !== undefined;
    updateEntitlementsLabel();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Failed to get customer info:', message);
    showError(message);
  }

  document.getElementById('paywall-btn')!.addEventListener('click', async () => {
    clearError();
    try {
      await RevenueCatUI.presentPaywall();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Failed to present paywall:', message);
      showError(message);
    }
  });

  document.getElementById('back-btn')!.addEventListener('click', showTestCases);
}

init();

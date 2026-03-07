import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { RevenueCatUI } from '@revenuecat/purchases-capacitor-ui';

const API_KEY = 'MAESTRO_TESTS_REVENUECAT_API_KEY';

let hasProEntitlement = false;

function updateEntitlementsLabel() {
  const label = document.getElementById('entitlements-label');
  if (label) label.textContent = `Entitlements: ${hasProEntitlement ? 'pro' : 'none'}`;
}

async function init() {
  await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
  await Purchases.configure({ apiKey: API_KEY });

  await Purchases.addCustomerInfoUpdateListener((info) => {
    hasProEntitlement = info.entitlements.active['pro'] !== undefined;
    updateEntitlementsLabel();
  });

  showTestCases();
}

function showTestCases() {
  document.getElementById('app')!.innerHTML = `
    <h1>Test Cases</h1>
    <button id="purchase-btn">Purchase through paywall</button>
  `;
  document.getElementById('purchase-btn')!.addEventListener('click', showPurchaseScreen);
}

async function showPurchaseScreen() {
  const { customerInfo } = await Purchases.getCustomerInfo();
  hasProEntitlement = customerInfo.entitlements.active['pro'] !== undefined;

  document.getElementById('app')!.innerHTML = `
    <div class="center">
      <p id="entitlements-label">Entitlements: ${hasProEntitlement ? 'pro' : 'none'}</p>
      <button id="paywall-btn">Present Paywall</button>
      <button id="back-btn" style="background-color: #888; margin-top: 16px;">Back</button>
    </div>
  `;

  document.getElementById('paywall-btn')!.addEventListener('click', async () => {
    await RevenueCatUI.presentPaywall();
    const updatedInfo = await Purchases.getCustomerInfo();
    hasProEntitlement = updatedInfo.customerInfo.entitlements.active['pro'] !== undefined;
    updateEntitlementsLabel();
  });

  document.getElementById('back-btn')!.addEventListener('click', showTestCases);
}

init();

import { CustomerInfo, Purchases } from '@revenuecat/purchases-capacitor';
import { RevenueCatUI } from '@revenuecat/purchases-capacitor-ui';
import { clearError, showError } from '../helpers';
import { showTestCases } from '../test_cases_screen';

export async function showPurchaseThroughPaywall() {
  let hasProEntitlement: boolean | null = null;
  let listenerId: string | null = null;

  function entitlementsText(): string {
    if (hasProEntitlement === null) return 'Entitlements: loading';
    return `Entitlements: ${hasProEntitlement ? 'pro' : 'none'}`;
  }

  function updateEntitlementsLabel() {
    const label = document.getElementById('entitlements-label');
    if (label) label.textContent = entitlementsText();
  }

  function applyCustomerInfo(info: CustomerInfo) {
    hasProEntitlement = info.entitlements.active['pro'] !== undefined;
    updateEntitlementsLabel();
  }

  async function cleanup() {
    if (listenerId) {
      try {
        await Purchases.removeCustomerInfoUpdateListener({ listenerToRemove: listenerId });
      } catch (error) {
        console.warn('Failed to remove customer info listener:', error);
      }
      listenerId = null;
    }
  }

  document.getElementById('app')!.innerHTML = `
    <div class="center">
      <p id="entitlements-label">${entitlementsText()}</p>
      <button id="paywall-btn">Present Paywall</button>
      <button id="back-btn" style="background-color: #888; margin-top: 16px;">Back</button>
    </div>
  `;

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

  document.getElementById('back-btn')!.addEventListener('click', async () => {
    await cleanup();
    showTestCases();
  });

  try {
    listenerId = await Purchases.addCustomerInfoUpdateListener(applyCustomerInfo);
    const { customerInfo } = await Purchases.getCustomerInfo();
    applyCustomerInfo(customerInfo);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Failed to get customer info:', message);
    showError(message);
  }
}

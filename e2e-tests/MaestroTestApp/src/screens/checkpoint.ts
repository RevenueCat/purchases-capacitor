import { RevenueCatUI } from '@revenuecat/purchases-capacitor-ui';

import { clearError, showError } from '../helpers';
import { showTestCases } from '../test_cases_screen';

const ENTITLEMENT_ID = 'pro';
const PRODUCT_ID = 'pro_monthly_subscription';

function listOrNone(values: string[]): string {
  return values.length ? values.sort().join(', ') : 'none';
}

export function showCheckpointScreen(identifier: string): void {
  let active = true;
  let invocations = 0;
  let removeCallback: (() => Promise<void>) | undefined;

  const app = document.getElementById('app')!;
  app.innerHTML = `
    <div class="center">
      <p id="checkpoint-identifier"></p>
      <button id="checkpoint-btn">Hit checkpoint</button>
      <p id="checkpoint-status">Callback: not invoked</p>
      <p id="checkpoint-invocations">Callback invocations: 0</p>
      <div id="checkpoint-result"></div>
      <button id="back-btn" style="background-color: #888; margin-top: 16px;">Back</button>
    </div>
  `;
  document.getElementById('checkpoint-identifier')!.textContent = `Identifier: ${identifier}`;
  const button = document.getElementById('checkpoint-btn') as HTMLButtonElement;
  const status = document.getElementById('checkpoint-status')!;
  const count = document.getElementById('checkpoint-invocations')!;
  const resultLines = document.getElementById('checkpoint-result')!;

  button.addEventListener('click', async () => {
    button.disabled = true;
    clearError();
    try {
      removeCallback = await RevenueCatUI.checkpoint(identifier, (result) => {
        if (!active) return;
        invocations += 1;
        const entitlements = result.flow?.obtainedEntitlements.map((e) => e.entitlementInfo.identifier) ?? [];
        const products = result.flow?.obtainedProducts.map((p) => p.product.identifier) ?? [];
        status.textContent = result.flow
          ? `Callback: passed, entitlements: ${listOrNone(entitlements)}`
          : 'Callback: passed, no flow';
        count.textContent = `Callback invocations: ${invocations}`;
        resultLines.replaceChildren();
        for (const text of [
          `Obtained products: ${listOrNone(products)}`,
          `Entitlement ${ENTITLEMENT_ID} obtained: ${entitlements.includes(ENTITLEMENT_ID)}`,
          `Product ${PRODUCT_ID} obtained: ${products.includes(PRODUCT_ID)}`,
          `Customer active entitlements: ${listOrNone(Object.keys(result.customer.entitlements.active))}`,
        ]) {
          const line = document.createElement('p');
          line.textContent = text;
          resultLines.appendChild(line);
        }
      });
      // Back can be pressed before native setup finishes.
      if (!active) await removeCallback();
    } catch (error) {
      if (!active) return;
      button.disabled = false;
      showError(error instanceof Error ? error.message : String(error));
    }
  });

  document.getElementById('back-btn')!.addEventListener('click', () => {
    active = false;
    void removeCallback?.();
    showTestCases();
  });
}

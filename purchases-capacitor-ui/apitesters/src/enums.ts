import { PAYWALL_RESULT } from '@revenuecat/purchases-typescript-internal-esm';

import { PURCHASE_LOGIC_RESULT } from '@revenuecat/purchases-capacitor-ui';

function checkPurchaseLogicResult(result: PURCHASE_LOGIC_RESULT): boolean {
  switch (result) {
    case PURCHASE_LOGIC_RESULT.SUCCESS:
      return true;
    case PURCHASE_LOGIC_RESULT.CANCELLATION:
      return true;
    case PURCHASE_LOGIC_RESULT.ERROR:
      return true;
  }
}

function checkPaywallResult(result: PAYWALL_RESULT): boolean {
  switch (result) {
    case PAYWALL_RESULT.NOT_PRESENTED:
      return true;
    case PAYWALL_RESULT.CANCELLED:
      return true;
    case PAYWALL_RESULT.PURCHASED:
      return true;
    case PAYWALL_RESULT.RESTORED:
      return true;
    case PAYWALL_RESULT.ERROR:
      return true;
  }
}

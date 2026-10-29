// Single registration point for every E2E test case.
// To add a new test case:
//   1. Create src/screens/your_test_case.ts that exports a `show*` function.
//   2. Add an entry to TEST_CASES below (import + one object keyed by the
//      Maestro `e2e_test_flow` argument value).
// Mirrors the pattern used by purchases-flutter (lib/test_cases.dart) and
// cordova-plugin-purchases (www/js/test_cases.js).

import { showCheckpointScreen } from './screens/checkpoint';
import { showPurchaseThroughPaywallScreen } from './screens/purchase_through_paywall';

export interface TestCase {
  title: string;
  show: () => void;
}

export const TEST_CASES: Record<string, TestCase> = {
  purchase_through_paywall: { title: 'Purchase through paywall', show: showPurchaseThroughPaywallScreen },
  checkpoint_purchase: {
    title: 'Checkpoint purchase',
    // This checkpoint presents its paywall to every user, with the monthly package preselected.
    show: () => showCheckpointScreen('donottouch_sdk_everyone'),
  },
  checkpoint_unknown_identifier: {
    title: 'Checkpoint unknown identifier',
    show: () => showCheckpointScreen('maestro_unknown_checkpoint'),
  },
};

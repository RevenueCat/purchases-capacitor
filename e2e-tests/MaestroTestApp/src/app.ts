import { registerPlugin } from '@capacitor/core';
import { LOG_LEVEL, Purchases } from '@revenuecat/purchases-capacitor';

import { showError } from './helpers';
import { TEST_CASES } from './test_cases';
import { showTestCases } from './test_cases_screen';

const API_KEY = 'MAESTRO_TESTS_REVENUECAT_API_KEY';

interface LaunchArgsPlugin {
  getTestFlow(): Promise<{ value: string | null }>;
}

const LaunchArgs = registerPlugin<LaunchArgsPlugin>('LaunchArgs');

async function init() {
  try {
    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
    await Purchases.configure({ apiKey: API_KEY });

    let testFlow: string | null = null;
    try {
      const result = await LaunchArgs.getTestFlow();
      testFlow = result.value;
    } catch (_) {
      /* launch args not available */
    }

    const match = testFlow ? TEST_CASES[testFlow] : null;
    if (match) {
      match.show();
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

init();

import { WebPlugin } from '@capacitor/core';
import type { PluginListenerHandle } from '@capacitor/core';
import { PAYWALL_RESULT } from '@revenuecat/purchases-typescript-internal-esm';

import type {
  PaywallResult,
  PresentPaywallIfNeededOptions,
  PresentPaywallOptions,
  RevenueCatUIPlugin,
} from './definitions';

export class RevenueCatUIWeb extends WebPlugin implements RevenueCatUIPlugin {
  private shouldMockWebResults = false;
  private webNotSupportedErrorMessage = 'RevenueCatUI is not supported on web platforms.';

  constructor() {
    super();
  }

  async setMockWebResults(options: { shouldMockWebResults: boolean }): Promise<void> {
    this.shouldMockWebResults = options.shouldMockWebResults;
    return Promise.resolve();
  }

  async presentPaywall(options?: PresentPaywallOptions): Promise<PaywallResult> {
    return this.mockReturningFunctionIfEnabled(
      'presentPaywall',
      {
        result: PAYWALL_RESULT.NOT_PRESENTED,
      },
      options,
    );
  }

  async presentPaywallIfNeeded(options: PresentPaywallIfNeededOptions): Promise<PaywallResult> {
    return this.mockReturningFunctionIfEnabled(
      'presentPaywallIfNeeded',
      {
        result: PAYWALL_RESULT.NOT_PRESENTED,
      },
      options,
    );
  }

  async presentCustomerCenter(): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('presentCustomerCenter');
  }

  async resumePurchaseInitiated(_options: {
    requestId: string;
    shouldProceed: boolean;
  }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('resumePurchaseInitiated');
  }

  async resumePurchaseLogicPurchase(_options: {
    requestId: string;
    result: string;
    error?: { code?: string; message?: string };
  }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('resumePurchaseLogicPurchase');
  }

  async resumePurchaseLogicRestore(_options: {
    requestId: string;
    result: string;
    error?: { code?: string; message?: string };
  }): Promise<void> {
    return this.mockNonReturningFunctionIfEnabled('resumePurchaseLogicRestore');
  }

  addListener(eventName: string, listener: (...args: any[]) => void): Promise<PluginListenerHandle> {
    if (eventName !== 'paywallDisplayed' && eventName !== 'paywallDismissed') {
      console.warn(`Unsupported event: ${eventName}`);
    }
    return super.addListener(eventName, listener);
  }

  removeAllListeners(): Promise<void> {
    return super.removeAllListeners();
  }

  private mockNonReturningFunctionIfEnabled(functionName: string): Promise<void> {
    if (!this.shouldMockWebResults) {
      return Promise.reject(this.webNotSupportedErrorMessage);
    }
    console.log(`${functionName} called on web with mocking enabled. No-op`);
    return Promise.resolve();
  }

  private mockReturningFunctionIfEnabled<T>(functionName: string, returnValue: T, options?: any): Promise<T> {
    if (!this.shouldMockWebResults) {
      return Promise.reject(this.webNotSupportedErrorMessage);
    }
    console.log(`${functionName} called on web with mocking enabled. Returning mocked value`, options);
    return Promise.resolve(returnValue);
  }
}

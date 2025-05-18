import { WebPlugin } from '@capacitor/core';
import type { PluginListenerHandle } from '@capacitor/core';

import { 
  PaywallResultEnum,
} from './definitions';
import type {
  PaywallResult,
  PresentPaywallIfNeededOptions,
  PresentPaywallOptions,
  RevenueCatUIPlugin
} from './definitions';

export class RevenueCatUIWeb extends WebPlugin implements RevenueCatUIPlugin {
  constructor() {
    super();
  }

  async presentPaywall(options?: PresentPaywallOptions): Promise<PaywallResult> {
    console.warn(
      'RevenueCatUI.presentPaywall is not implemented on web',
      options
    );
    
    return {
      result: PaywallResultEnum.NOT_PRESENTED,
    };
  }

  async presentPaywallIfNeeded(options: PresentPaywallIfNeededOptions): Promise<PaywallResult> {
    console.warn(
      'RevenueCatUI.presentPaywallIfNeeded is not implemented on web',
      options
    );
    
    return {
      result: PaywallResultEnum.NOT_PRESENTED,
    };
  }

  async presentCustomerCenter(): Promise<void> {
    console.warn(
      'RevenueCatUI.presentCustomerCenter is not implemented on web'
    );
  }

  addListener(
    eventName: string,
    listener: (...args: any[]) => void
  ): Promise<PluginListenerHandle> {
    if (eventName !== 'paywallDisplayed' && eventName !== 'paywallDismissed') {
      console.warn(`Unsupported event: ${eventName}`);
    }
    return super.addListener(eventName, listener);
  }

  removeAllListeners(): Promise<void> {
    return super.removeAllListeners();
  }
} 
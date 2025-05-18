import { WebPlugin, type PluginListenerHandle } from '@capacitor/core';

import { 
  PaywallResultEnum,
  type PaywallResult,
  type PresentPaywallIfNeededOptions, 
  type PresentPaywallOptions, 
  type RevenueCatUIPlugin 
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
    eventName: 'paywallDisplayed' | 'paywallDismissed', 
    listener: () => void
  ): Promise<PluginListenerHandle> {
    return super.addListener(eventName, listener);
  }

  removeAllListeners(): Promise<void> {
    return super.removeAllListeners();
  }
} 
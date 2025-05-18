import type { PluginListenerHandle } from '@capacitor/core';

export interface RevenueCatUIPlugin {
  /**
   * Presents a paywall configured in the RevenueCat dashboard.
   * @param options The options for presenting the paywall.
   * @returns A PaywallResult indicating what happened during the paywall presentation.
   */
  presentPaywall(options?: PresentPaywallOptions): Promise<PaywallResult>;

  /**
   * Presents a paywall only if the user does not have the specified entitlement.
   * @param options The options for presenting the paywall if needed.
   * @returns A PaywallResult indicating what happened during the paywall presentation.
   */
  presentPaywallIfNeeded(options: PresentPaywallIfNeededOptions): Promise<PaywallResult>;

  /**
   * Presents the customer center where users can manage their subscriptions.
   */
  presentCustomerCenter(): Promise<void>;

  /**
   * Listen for when a paywall is displayed or dismissed.
   * @param eventName The event to listen for
   * @param listener The listener to call when the event is triggered
   */
  addListener(eventName: 'paywallDisplayed' | 'paywallDismissed', listener: () => void): Promise<PluginListenerHandle>;

  /**
   * Remove all listeners for this plugin.
   */
  removeAllListeners(): Promise<void>;
}

export interface PresentPaywallOptions {
  /**
   * The identifier of the offering to present.
   * If not provided, the current offering will be used.
   */
  offeringIdentifier?: string;

  /**
   * Whether to display a close button on the paywall.
   * Only applicable for original template paywalls, ignored for V2 Paywalls.
   */
  displayCloseButton?: boolean;
}

export interface PresentPaywallIfNeededOptions extends PresentPaywallOptions {
  /**
   * The identifier of the entitlement that is required.
   * The paywall will only be presented if the user doesn't have this entitlement.
   */
  requiredEntitlementIdentifier: string;
}

export enum PaywallResultEnum {
  /**
   * The paywall wasn't presented because the user already has the required entitlement.
   */
  NOT_PRESENTED = 'NOT_PRESENTED',

  /**
   * The user cancelled the paywall without purchasing anything.
   */
  CANCELLED = 'CANCELLED',

  /**
   * An error occurred while presenting the paywall.
   */
  ERROR = 'ERROR',

  /**
   * The user made a purchase.
   */
  PURCHASED = 'PURCHASED',

  /**
   * The user restored a previous purchase.
   */
  RESTORED = 'RESTORED',
}

export interface PaywallResult {
  /**
   * The result of the paywall presentation.
   */
  result: PaywallResultEnum;
}

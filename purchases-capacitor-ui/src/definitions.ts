import type { PluginListenerHandle } from '@capacitor/core';
import type {
  CustomerInfo,
  PurchasesError,
  PurchasesOffering,
  PurchasesPackage,
  PurchasesStoreTransaction,
} from '@revenuecat/purchases-typescript-internal-esm';
import { PAYWALL_RESULT } from '@revenuecat/purchases-typescript-internal-esm';

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
   * Used for web only. Enables or disables returning mock results instead of rejecting promises with "not supported".
   * For testing purposes only.
   * @param options Options for mock web results
   */
  setMockWebResults?(options: { shouldMockWebResults: boolean }): Promise<void>;

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

/**
 * Object passed to onPurchaseInitiated that allows the developer to
 * control when (and whether) the purchase flow continues.
 * The developer can store this and call resume() asynchronously
 * (e.g., after an auth flow on a different screen).
 */
export interface PurchaseResumable {
  /** Call to proceed with or cancel the purchase. Defaults to true (proceed). */
  resume(shouldProceed?: boolean): void;
}

/**
 * Callbacks for observing paywall lifecycle events such as purchases,
 * restores, and errors. All callbacks are optional.
 *
 * Pass as `listener` in {@link PresentPaywallOptions} to receive events
 * while the paywall is displayed.
 */
export interface PaywallListener {
  /** Called when a purchase begins for a package. */
  onPurchaseStarted?: (args: { packageBeingPurchased: PurchasesPackage }) => void;
  /** Called when a purchase completes successfully. */
  onPurchaseCompleted?: (args: { customerInfo: CustomerInfo; storeTransaction: PurchasesStoreTransaction }) => void;
  /** Called when a purchase fails with an error. */
  onPurchaseError?: (args: { error: PurchasesError }) => void;
  /** Called when the user cancels a purchase. */
  onPurchaseCancelled?: () => void;
  /** Called when a restore operation begins. */
  onRestoreStarted?: () => void;
  /** Called when a restore operation completes successfully. */
  onRestoreCompleted?: (args: { customerInfo: CustomerInfo }) => void;
  /** Called when a restore operation fails with an error. */
  onRestoreError?: (args: { error: PurchasesError }) => void;
  /**
   * Called before the payment sheet is displayed, allowing the app to gate
   * the purchase flow (e.g., require authentication first).
   *
   * The developer receives a {@link PurchaseResumable} that can be stored
   * and called asynchronously. Call `resumable.resume(true)` to proceed
   * with the purchase, or `resumable.resume(false)` to cancel it.
   *
   * If this callback is not provided, the purchase proceeds automatically.
   */
  onPurchaseInitiated?: (args: { packageBeingPurchased: PurchasesPackage; resumable: PurchaseResumable }) => void;
}

/**
 * Custom purchase and restore handlers for apps that manage their own
 * purchase flow (`purchasesAreCompletedBy: MY_APP`).
 *
 * When provided in {@link PresentPaywallOptions}, the paywall delegates
 * purchase and restore operations to these handlers instead of using
 * RevenueCat's built-in purchase flow.
 */
export interface PurchaseLogic {
  /**
   * Called when the user initiates a purchase from the paywall.
   * Perform the purchase using your own payment system and return the result.
   */
  performPurchase: (args: { packageToPurchase: PurchasesPackage }) => Promise<PurchaseLogicResult>;
  /**
   * Called when the user initiates a restore from the paywall.
   * Perform the restore using your own system and return the result.
   */
  performRestore: () => Promise<PurchaseLogicResult>;
}

/**
 * The result of a custom purchase or restore operation performed by {@link PurchaseLogic}.
 */
export type PurchaseLogicResult =
  | { result: PURCHASE_LOGIC_RESULT.SUCCESS }
  | { result: PURCHASE_LOGIC_RESULT.CANCELLATION }
  | { result: PURCHASE_LOGIC_RESULT.ERROR; error?: PurchasesError };

/**
 * Possible outcomes from a custom {@link PurchaseLogic} operation.
 */
export enum PURCHASE_LOGIC_RESULT {
  /** The purchase or restore completed successfully. */
  SUCCESS = 'SUCCESS',
  /** The user cancelled the purchase or restore. */
  CANCELLATION = 'CANCELLATION',
  /** The purchase or restore failed with an error. */
  ERROR = 'ERROR',
}

export interface PresentPaywallOptions {
  /**
   * The offering to present.
   * If not provided, the current offering will be used.
   */
  offering?: PurchasesOffering;

  /**
   * Whether to display a close button on the paywall.
   * Only applicable for original template paywalls, ignored for V2 Paywalls.
   */
  displayCloseButton?: boolean;

  /**
   * Optional listener for paywall lifecycle events such as purchase
   * completion, restoration, and errors.
   */
  listener?: PaywallListener;

  /**
   * Optional custom purchase/restore logic for when
   * `purchasesAreCompletedBy` is set to `MY_APP`.
   */
  purchaseLogic?: PurchaseLogic;
}

export interface PresentPaywallIfNeededOptions extends PresentPaywallOptions {
  /**
   * The identifier of the entitlement that is required.
   * The paywall will only be presented if the user doesn't have this entitlement.
   */
  requiredEntitlementIdentifier: string;
}

// Using the enum from purchases-typescript-internal-esm instead of defining our own
export { PAYWALL_RESULT as PaywallResultEnum };

export interface PaywallResult {
  /**
   * The result of the paywall presentation.
   */
  result: PAYWALL_RESULT;
}

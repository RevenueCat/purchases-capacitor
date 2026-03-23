import type {
  CustomerInfo,
  PurchasesError,
  PurchasesOffering,
  PurchasesPackage,
  PurchasesStoreTransaction,
} from '@revenuecat/purchases-typescript-internal-esm';
import { PAYWALL_RESULT } from '@revenuecat/purchases-typescript-internal-esm';

import type {
  PaywallListener,
  PaywallResult,
  PresentPaywallIfNeededOptions,
  PresentPaywallOptions,
  PurchaseLogic,
  PurchaseLogicResult,
  PurchaseResumable,
} from '@revenuecat/purchases-capacitor-ui';
import { PURCHASE_LOGIC_RESULT } from '@revenuecat/purchases-capacitor-ui';

function checkPresentPaywallOptions(options: PresentPaywallOptions) {
  const offering: PurchasesOffering | undefined = options.offering;
  const displayCloseButton: boolean | undefined = options.displayCloseButton;
  const listener: PaywallListener | undefined = options.listener;
  const purchaseLogic: PurchaseLogic | undefined = options.purchaseLogic;
}

function checkPresentPaywallIfNeededOptions(options: PresentPaywallIfNeededOptions) {
  const requiredEntitlementIdentifier: string = options.requiredEntitlementIdentifier;
  const offering: PurchasesOffering | undefined = options.offering;
  const displayCloseButton: boolean | undefined = options.displayCloseButton;
  const listener: PaywallListener | undefined = options.listener;
  const purchaseLogic: PurchaseLogic | undefined = options.purchaseLogic;
}

function checkPaywallResult(result: PaywallResult) {
  const paywallResult: PAYWALL_RESULT = result.result;
}

function checkPaywallListener(listener: PaywallListener) {
  const onPurchaseStarted: ((args: { packageBeingPurchased: PurchasesPackage }) => void) | undefined =
    listener.onPurchaseStarted;
  const onPurchaseCompleted:
    | ((args: { customerInfo: CustomerInfo; storeTransaction: PurchasesStoreTransaction }) => void)
    | undefined = listener.onPurchaseCompleted;
  const onPurchaseError: ((args: { error: PurchasesError }) => void) | undefined = listener.onPurchaseError;
  const onPurchaseCancelled: (() => void) | undefined = listener.onPurchaseCancelled;
  const onRestoreStarted: (() => void) | undefined = listener.onRestoreStarted;
  const onRestoreCompleted: ((args: { customerInfo: CustomerInfo }) => void) | undefined = listener.onRestoreCompleted;
  const onRestoreError: ((args: { error: PurchasesError }) => void) | undefined = listener.onRestoreError;
  const onPurchaseInitiated:
    | ((args: { packageBeingPurchased: PurchasesPackage; resumable: PurchaseResumable }) => void)
    | undefined = listener.onPurchaseInitiated;
}

function checkPurchaseResumable(resumable: PurchaseResumable) {
  resumable.resume();
  resumable.resume(true);
  resumable.resume(false);
}

function checkPurchaseLogic(logic: PurchaseLogic) {
  const performPurchase: (args: { packageToPurchase: PurchasesPackage }) => Promise<PurchaseLogicResult> =
    logic.performPurchase;
  const performRestore: () => Promise<PurchaseLogicResult> = logic.performRestore;
}

function checkPurchaseLogicResult() {
  const success: PurchaseLogicResult = { result: PURCHASE_LOGIC_RESULT.SUCCESS };
  const cancellation: PurchaseLogicResult = { result: PURCHASE_LOGIC_RESULT.CANCELLATION };
  const errorOnly: PurchaseLogicResult = { result: PURCHASE_LOGIC_RESULT.ERROR };
  const errorWithDetails: PurchaseLogicResult = {
    result: PURCHASE_LOGIC_RESULT.ERROR,
    error: {} as PurchasesError,
  };
}

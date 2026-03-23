import type { PluginListenerHandle } from '@capacitor/core';
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
  PaywallPresentationConfiguration,
  PaywallResult,
  PresentPaywallIfNeededOptions,
  PresentPaywallOptions,
  PurchaseLogic,
  PurchaseLogicResult,
  PurchaseResumable,
  RevenueCatUIPlugin,
} from '@revenuecat/purchases-capacitor-ui';
import {
  IOS_PAYWALL_PRESENTATION_STYLE,
  PaywallPresentationConfiguration as PaywallPresentationConfigurationPresets,
  PURCHASE_LOGIC_RESULT,
  PaywallResultEnum,
} from '@revenuecat/purchases-capacitor-ui';

async function checkPresentPaywall(plugin: RevenueCatUIPlugin) {
  const result1: PaywallResult = await plugin.presentPaywall();

  const result2: PaywallResult = await plugin.presentPaywall({});

  const offering = {} as PurchasesOffering;
  const result3: PaywallResult = await plugin.presentPaywall({
    offering,
  });

  const result4: PaywallResult = await plugin.presentPaywall({
    displayCloseButton: true,
  });

  const result5: PaywallResult = await plugin.presentPaywall({
    offering,
    displayCloseButton: false,
  });
}

async function checkPresentPaywallIfNeeded(plugin: RevenueCatUIPlugin) {
  const result1: PaywallResult = await plugin.presentPaywallIfNeeded({
    requiredEntitlementIdentifier: 'pro',
  });

  const offering = {} as PurchasesOffering;
  const result2: PaywallResult = await plugin.presentPaywallIfNeeded({
    requiredEntitlementIdentifier: 'pro',
    offering,
    displayCloseButton: true,
  });
}

async function checkPresentCustomerCenter(plugin: RevenueCatUIPlugin) {
  await plugin.presentCustomerCenter();
}

async function checkSetMockWebResults(plugin: RevenueCatUIPlugin) {
  if (plugin.setMockWebResults) {
    await plugin.setMockWebResults({ shouldMockWebResults: true });
    await plugin.setMockWebResults({ shouldMockWebResults: false });
  }
}

async function checkListeners(plugin: RevenueCatUIPlugin) {
  const handle1: PluginListenerHandle = await plugin.addListener('paywallDisplayed', () => {});
  const handle2: PluginListenerHandle = await plugin.addListener('paywallDismissed', () => {});
  await handle1.remove();
  await handle2.remove();
  await plugin.removeAllListeners();
}

async function checkPaywallListener(plugin: RevenueCatUIPlugin) {
  const listener: PaywallListener = {
    onPurchaseStarted: (args: { packageBeingPurchased: PurchasesPackage }) => {},
    onPurchaseCompleted: (args: { customerInfo: CustomerInfo; storeTransaction: PurchasesStoreTransaction }) => {},
    onPurchaseError: (args: { error: PurchasesError }) => {},
    onPurchaseCancelled: () => {},
    onRestoreStarted: () => {},
    onRestoreCompleted: (args: { customerInfo: CustomerInfo }) => {},
    onRestoreError: (args: { error: PurchasesError }) => {},
    onPurchaseInitiated: (args: { packageBeingPurchased: PurchasesPackage; resumable: PurchaseResumable }) => {
      args.resumable.resume();
      args.resumable.resume(true);
      args.resumable.resume(false);
    },
  };

  const result: PaywallResult = await plugin.presentPaywall({ listener });
}

async function checkPurchaseLogic(plugin: RevenueCatUIPlugin) {
  const purchaseLogic: PurchaseLogic = {
    performPurchase: async (args: { packageToPurchase: PurchasesPackage }): Promise<PurchaseLogicResult> => {
      return { result: PURCHASE_LOGIC_RESULT.SUCCESS };
    },
    performRestore: async (): Promise<PurchaseLogicResult> => {
      return { result: PURCHASE_LOGIC_RESULT.CANCELLATION };
    },
  };

  const result: PaywallResult = await plugin.presentPaywall({ purchaseLogic });
}

async function checkPurchaseLogicResults() {
  const success: PurchaseLogicResult = { result: PURCHASE_LOGIC_RESULT.SUCCESS };
  const cancellation: PurchaseLogicResult = { result: PURCHASE_LOGIC_RESULT.CANCELLATION };
  const errorWithoutDetails: PurchaseLogicResult = { result: PURCHASE_LOGIC_RESULT.ERROR };
  const errorWithDetails: PurchaseLogicResult = {
    result: PURCHASE_LOGIC_RESULT.ERROR,
    error: {} as PurchasesError,
  };
}

async function checkPaywallResult() {
  const notPresented: PaywallResult = { result: PAYWALL_RESULT.NOT_PRESENTED };
  const cancelled: PaywallResult = { result: PAYWALL_RESULT.CANCELLED };
  const purchased: PaywallResult = { result: PAYWALL_RESULT.PURCHASED };
  const restored: PaywallResult = { result: PAYWALL_RESULT.RESTORED };
  const error: PaywallResult = { result: PAYWALL_RESULT.ERROR };
}

async function checkPaywallResultEnum() {
  const notPresented: PaywallResult = { result: PaywallResultEnum.NOT_PRESENTED };
  const cancelled: PaywallResult = { result: PaywallResultEnum.CANCELLED };
  const purchased: PaywallResult = { result: PaywallResultEnum.PURCHASED };
  const restored: PaywallResult = { result: PaywallResultEnum.RESTORED };
  const error: PaywallResult = { result: PaywallResultEnum.ERROR };
}

async function checkPresentationConfiguration(plugin: RevenueCatUIPlugin) {
  const result1: PaywallResult = await plugin.presentPaywall({
    presentationConfiguration: PaywallPresentationConfigurationPresets.FULL_SCREEN,
  });

  const result2: PaywallResult = await plugin.presentPaywall({
    presentationConfiguration: PaywallPresentationConfigurationPresets.DEFAULT,
  });

  const result3: PaywallResult = await plugin.presentPaywall({
    presentationConfiguration: {
      ios: IOS_PAYWALL_PRESENTATION_STYLE.SHEET,
    },
  });

  const result4: PaywallResult = await plugin.presentPaywallIfNeeded({
    requiredEntitlementIdentifier: 'pro',
    presentationConfiguration: PaywallPresentationConfigurationPresets.FULL_SCREEN,
  });
}

async function checkCustomVariables(plugin: RevenueCatUIPlugin) {
  const result: PaywallResult = await plugin.presentPaywall({
    customVariables: { name: 'John', discount: 10, isVip: true },
  });

  const result2: PaywallResult = await plugin.presentPaywallIfNeeded({
    requiredEntitlementIdentifier: 'pro',
    customVariables: { planName: 'Premium' },
  });
}

async function checkCombinedOptions(plugin: RevenueCatUIPlugin) {
  const offering = {} as PurchasesOffering;
  const listener: PaywallListener = {};
  const purchaseLogic: PurchaseLogic = {
    performPurchase: async () => ({ result: PURCHASE_LOGIC_RESULT.SUCCESS }),
    performRestore: async () => ({ result: PURCHASE_LOGIC_RESULT.SUCCESS }),
  };

  const result: PaywallResult = await plugin.presentPaywall({
    offering,
    displayCloseButton: true,
    listener,
    purchaseLogic,
    presentationConfiguration: PaywallPresentationConfigurationPresets.FULL_SCREEN,
    customVariables: { name: 'John' },
  });

  const result2: PaywallResult = await plugin.presentPaywallIfNeeded({
    requiredEntitlementIdentifier: 'pro',
    offering,
    displayCloseButton: false,
    listener,
    purchaseLogic,
    presentationConfiguration: PaywallPresentationConfigurationPresets.DEFAULT,
    customVariables: { discount: 20 },
  });
}

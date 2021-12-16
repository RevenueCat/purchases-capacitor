import { WebPlugin } from '@capacitor/core';

import type { CapacitorPurchasesPlugin, LogInResult, PurchaserInfo, Offerings } from './definitions';
// import type { CapacitorPurchasesPlugin, LogInResult, PurchaserInfo, Offerings, Package, UpgradeInfo } from './definitions';

export class CapacitorPurchasesWeb
  extends WebPlugin
  implements CapacitorPurchasesPlugin {
  // add all missing declaration
  setup(data: {
    apiKey: string,
  }): Promise<void> {
    console.log('setup', data);
    throw new Error("Method not implemented.");
  }

  async getOfferings(): Promise<{offerings: Offerings}> {
    console.log('getOfferings');
    throw new Error("Method not implemented.");
  }

  async purchasePackage(data: {
    // aPackage: Package,
    identifier: string,
    offeringIdentifier: string,
    // upgradeInfo?: UpgradeInfo | null
  }): Promise<{ productIdentifier: string; purchaserInfo: PurchaserInfo; }> {
    console.log('purchasePackage', data);
    throw new Error("Method not implemented.");
  }

  async restoreTransactions(
  ): Promise<{ purchaserInfo: PurchaserInfo; }> {
    console.log('purchasePackage');
    throw new Error("Method not implemented.");
  }

  async setAttributes(data: {attributes: { [key: string]: string | null }}): Promise<void> {
    console.log('setAttributes', data);
    throw new Error("Method not implemented.");
  }

  async logIn(data: {
    appUserID: string, 
  }): Promise<LogInResult> {
    console.log('logIn', data);
    throw new Error("Method not implemented.");
  }

  async logOut(
  ): Promise<{ purchaserInfo: PurchaserInfo }> {
    console.log('logOut');
    throw new Error("Method not implemented.");
  }
  async getPurchaserInfo(
  ): Promise<{ purchaserInfo: PurchaserInfo }> {
    console.log('getPurchaserInfo');
    throw new Error("Method not implemented.");
  }
  async setDebugLogsEnabled(data: {enabled: boolean}): Promise<void> {
    console.log('setDebugLogsEnabled', data);
    throw new Error("Method not implemented.");
  }
}
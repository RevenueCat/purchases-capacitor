import { WebPlugin } from '@capacitor/core';

import type { CapacitorPurchasesPlugin, LogInResult, PurchaserInfo, PurchasesOfferings, PurchasesPackage, UpgradeInfo } from './definitions';

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

  async getOfferings(): Promise<{data: {offerings: PurchasesOfferings}}> {
    console.log('getOfferings');
    throw new Error("Method not implemented.");
  }

  async purchasePackage(data: {
    aPackage: PurchasesPackage,
    upgradeInfo?: UpgradeInfo | null
  }): Promise<{data: { productIdentifier: string; purchaserInfo: PurchaserInfo; }}> {
    console.log('purchasePackage', data);
    throw new Error("Method not implemented.");
  }

  async restoreTransactions(
  ): Promise<{data: { purchaserInfo: PurchaserInfo; }}> {
    console.log('purchasePackage');
    throw new Error("Method not implemented.");
  }

  async setAttributes(data: {attributes: { [key: string]: string | null }}): Promise<void> {
    console.log('setAttributes', data);
    throw new Error("Method not implemented.");
  }

  async logIn(data: {
    appUserID: string, 
  }): Promise<{data: LogInResult }> {
    console.log('logIn', data);
    throw new Error("Method not implemented.");
  }

  async logOut(
  ): Promise<{data: { purchaserInfo: PurchaserInfo }}> {
    console.log('logOut');
    throw new Error("Method not implemented.");
  }
  async getPurchaserInfo(
  ): Promise<{data: { purchaserInfo: PurchaserInfo }}> {
    console.log('getPurchaserInfo');
    throw new Error("Method not implemented.");
  }
  async setDebugLogsEnabled(data: {enabled: boolean}): Promise<void> {
    console.log('setDebugLogsEnabled', data);
    throw new Error("Method not implemented.");
  }
}
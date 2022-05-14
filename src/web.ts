import { WebPlugin } from '@capacitor/core';

import { PACKAGE_TYPE } from './definitions';
import type { CapacitorPurchasesPlugin, LogInResult, PurchaserInfo, Offerings, Offering, Package } from './definitions';

export const mockPack: Package = {
  identifier: 'com.example.test',
  packageType: PACKAGE_TYPE.ANNUAL,
  product: {
    identifier: 'com.example.test',
    description: 'Test',
    title: 'Test',
    price: 0.99,
    priceString: '$0.99',
    currencyCode: 'USD',
    currencySymbol: '$',
    isFamilyShareable: false,
    subscriptionGroupIdentifier: 'com.example.test',
    subscriptionPeriod: {
      numberOfUnits: 1,
      unit: 1,
    },
    introductoryPrice: null,
    discounts: [],
  },
  offeringIdentifier: 'com.example.test.offering1'
} 

export const mockCurrent: Offering = {
  identifier: 'com.example.test.test',
  serverDescription: "Test",
  availablePackages: [mockPack],
  lifetime: mockPack,
  annual: mockPack,
  sixMonth: mockPack,
  threeMonth: mockPack,
  twoMonth: mockPack,
  monthly: mockPack,
  weekly: mockPack,
};

export const mockPurchaserInfo: PurchaserInfo = {
  entitlements: {
    all: {},
    active: {},
  },
  activeSubscriptions: [''],
  allPurchasedProductIdentifiers: [''],
  nonSubscriptionTransactions: [],
  latestExpirationDate: null,
  firstSeen: '2020-01-01T00:00:00.000Z',
  originalAppUserId: '',
  requestDate: '2020-01-01T00:00:00.000Z',
  originalApplicationVersion: '',
  originalPurchaseDate: null,
  managementURL: null
}

export const mockAll: {[key: string]: Offering} = {
  "current": mockCurrent
}


export const mockOffering: Offerings = {
  all: mockAll,
  current: mockCurrent
}

export class CapacitorPurchasesWeb
  extends WebPlugin
  implements CapacitorPurchasesPlugin {

  setup(data: {
    apiKey: string,
  }): Promise<void> {
    console.error('setup only mocked in web', data);
    return Promise.resolve();
  }

  async getOfferings(): Promise<{offerings: Offerings}> {
    console.error('getOfferings only mocked in web');
    return {offerings: mockOffering};
  }

  async purchasePackage(data: {
    identifier: string,
    offeringIdentifier: string,
  }): Promise<{ purchaserInfo: PurchaserInfo; }> {
    console.error('purchasePackage only mocked in web', data);
    return { purchaserInfo: mockPurchaserInfo };
  }

  async restoreTransactions(
  ): Promise<{ purchaserInfo: PurchaserInfo; }> {
    console.error('purchasePackage only mocked in web');
    return { purchaserInfo: mockPurchaserInfo };
  }

  async setAttributes(data: {attributes: { [key: string]: string | null }}): Promise<void> {
    console.error('setAttributes only mocked in web', data);
    return Promise.resolve();
  }

  async logIn(data: {
    appUserID: string, 
  }): Promise<LogInResult> {
    console.error('logIn only mocked in web', data);
    return {
      purchaserInfo: mockPurchaserInfo,
      created: true,
    }
  }

  async logOut(
  ): Promise<{ purchaserInfo: PurchaserInfo }> {
    console.error('logOut only mocked in web');
    return { purchaserInfo: mockPurchaserInfo };
  }

  async getPurchaserInfo(
  ): Promise<{ purchaserInfo: PurchaserInfo }> {
    console.error('getPurchaserInfo only mocked in web');
    return { purchaserInfo: mockPurchaserInfo };
  }

  async setDebugLogsEnabled(data: {enabled: boolean}): Promise<void> {
    console.error('setDebugLogsEnabled only mocked in web', data);
  }
}
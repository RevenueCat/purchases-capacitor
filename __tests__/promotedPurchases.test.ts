import type { MakePurchaseResult } from '../src/definitions';

const mockNative = {
  addShouldPurchasePromoProductListener: jest.fn(),
  removeShouldPurchasePromoProductListener: jest.fn(async () => ({ wasRemoved: true })),
  makeDeferredPurchase: jest.fn(),
};
jest.mock('@capacitor/core', () => ({ registerPlugin: () => mockNative }));
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Purchases } = require('../src/index');

beforeEach(() => {
  jest.clearAllMocks();
  mockNative.addShouldPurchasePromoProductListener.mockImplementation((listener) => {
    listener({ callbackID: 'pending-purchase' });
    return Promise.resolve('listener-id');
  });
});

it('delivers a deferred function without starting the purchase, including synchronous replay', async () => {
  const result = { productIdentifier: 'promoted' } as MakePurchaseResult;
  mockNative.makeDeferredPurchase.mockResolvedValue(result);
  mockNative.addShouldPurchasePromoProductListener.mockImplementation((listener) => {
    listener({ callbackID: 'pending-purchase' });
    return Promise.resolve('listener-id');
  });
  let deferredPurchase!: () => Promise<MakePurchaseResult>;
  await expect(
    Purchases.addShouldPurchasePromoProductListener((purchase: typeof deferredPurchase) => {
      deferredPurchase = purchase;
    }),
  ).resolves.toBe('listener-id');
  expect(mockNative.makeDeferredPurchase).not.toHaveBeenCalled();
  await expect(deferredPurchase()).resolves.toBe(result);
  expect(mockNative.makeDeferredPurchase).toHaveBeenCalledWith({ callbackID: 'pending-purchase' });
});

it('normalizes deferred purchase errors through the public proxy', async () => {
  mockNative.makeDeferredPurchase.mockRejectedValue(
    Object.assign(new Error('cancelled'), {
      code: '1',
      data: { code: 1, message: 'cancelled', userCancelled: true },
    }),
  );
  let deferredPurchase!: () => Promise<MakePurchaseResult>;
  await Purchases.addShouldPurchasePromoProductListener((purchase: typeof deferredPurchase) => {
    deferredPurchase = purchase;
  });
  await expect(deferredPurchase()).rejects.toMatchObject({ code: '1', userCancelled: true });
});

it('passes listener removal options unchanged', async () => {
  await expect(
    Purchases.removeShouldPurchasePromoProductListener({ listenerToRemove: 'listener-id' }),
  ).resolves.toEqual({ wasRemoved: true });
  expect(mockNative.removeShouldPurchasePromoProductListener).toHaveBeenCalledWith({ listenerToRemove: 'listener-id' });
});

it('ignores terminal native callback responses when removed or unsupported', async () => {
  mockNative.addShouldPurchasePromoProductListener.mockImplementation((listener) => {
    listener(undefined);
    listener({});
    return Promise.resolve('listener-id');
  });
  const listener = jest.fn();
  await expect(Purchases.addShouldPurchasePromoProductListener(listener)).resolves.toBe('listener-id');
  expect(listener).not.toHaveBeenCalled();
  expect(mockNative.makeDeferredPurchase).not.toHaveBeenCalled();
});

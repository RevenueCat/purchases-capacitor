import { PurchasesWeb } from '../src/web';

it('provides a complete deferred-purchase mock result when web mocks are enabled', async () => {
  const plugin = new PurchasesWeb();
  await plugin.setMockWebResults({ shouldMockWebResults: true });
  const result = await plugin.makeDeferredPurchase({ callbackID: 'mock-pending' });
  expect(result.productIdentifier).toBe('mock-promoted-product');
  expect(result.customerInfo.entitlements.active).toEqual({});
  expect(result.transaction.productIdentifier).toBe(result.productIdentifier);
  await expect(plugin.removeShouldPurchasePromoProductListener({ listenerToRemove: 'mock-id' })).resolves.toEqual({
    wasRemoved: false,
  });
});

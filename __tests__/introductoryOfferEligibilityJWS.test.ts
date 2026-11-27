import type { PurchaseStoreProductOptions, PurchasePackageOptions } from '../src/definitions';
import { PurchasesWeb } from '../src/web';

const product = { identifier: 'product' } as PurchaseStoreProductOptions['product'];
const aPackage = { identifier: 'monthly', product } as PurchasePackageOptions['aPackage'];

describe('introductory offer eligibility JWS on web', () => {
  const web = new PurchasesWeb();
  beforeEach(async () => {
    await web.setMockWebResults({ shouldMockWebResults: true });
  });
  for (const token of ['header.deny.signature', '', false]) {
    it(`rejects a supplied token instead of returning a mock purchase (${String(token)})`, async () => {
      await expect(
        web.purchaseStoreProduct({ product, introductoryOfferEligibilityJWS: token as string }),
      ).rejects.toThrow();
      await expect(
        web.purchasePackage({ aPackage, introductoryOfferEligibilityJWS: token as string }),
      ).rejects.toThrow();
    });
  }
  it.each([null, undefined])('preserves mocked purchase behavior for absent token %s', async (token) => {
    await expect(web.purchaseStoreProduct({ product, introductoryOfferEligibilityJWS: token })).resolves.toHaveProperty(
      'productIdentifier',
      'product',
    );
    await expect(web.purchasePackage({ aPackage, introductoryOfferEligibilityJWS: token })).resolves.toHaveProperty(
      'productIdentifier',
      'product',
    );
  });
});

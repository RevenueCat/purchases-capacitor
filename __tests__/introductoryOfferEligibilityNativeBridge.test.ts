const purchaseStoreProduct = jest.fn();
const purchasePackage = jest.fn();
const tokenPurchase = jest.fn();
const native = { purchaseStoreProduct, purchasePackage, purchaseWithIntroductoryOfferEligibilityJWS: tokenPurchase };

jest.mock('@capacitor/core', () => ({ registerPlugin: () => native }));
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Purchases } = require('../src/index');

beforeEach(() => {
  jest.clearAllMocks();
  tokenPurchase.mockResolvedValue({ productIdentifier: 'product' });
  native.purchaseWithIntroductoryOfferEligibilityJWS = tokenPurchase;
});

for (const method of ['purchaseStoreProduct', 'purchasePackage']) {
  test(`${method} preserves exact token and options through a dedicated native entry point`, async () => {
    const options = {
      introductoryOfferEligibilityJWS: 'header.deny.signature',
      product: { identifier: 'product' },
      aPackage: { identifier: 'monthly' },
    };
    await Purchases[method](options);
    expect(tokenPurchase).toHaveBeenCalledWith({
      ...options,
      purchasableItemType: method === 'purchaseStoreProduct' ? 'product' : 'package',
    });
    expect(purchaseStoreProduct).not.toHaveBeenCalled();
    expect(purchasePackage).not.toHaveBeenCalled();
  });
  test.each([null, undefined])(`${method} retains the existing bridge for %s`, async (token) => {
    const options = { introductoryOfferEligibilityJWS: token };
    await Purchases[method](options);
    expect(native[method as 'purchaseStoreProduct']).toHaveBeenCalledWith(options);
    expect(tokenPurchase).not.toHaveBeenCalled();
  });
  test(`${method} cannot silently purchase with an older native plugin`, async () => {
    // Models an older native implementation whose existing purchase method ignores unknown options.
    native.purchaseWithIntroductoryOfferEligibilityJWS = undefined as unknown as typeof tokenPurchase;
    await expect(async () =>
      Purchases[method]({ introductoryOfferEligibilityJWS: 'header.deny.signature' }),
    ).rejects.toThrow();
    expect(purchaseStoreProduct).not.toHaveBeenCalled();
    expect(purchasePackage).not.toHaveBeenCalled();
  });
  test(`${method} propagates native rejection without a fallback purchase`, async () => {
    tokenPurchase.mockRejectedValueOnce(new Error('unsupported PHC'));
    await expect(Purchases[method]({ introductoryOfferEligibilityJWS: 'header.deny.signature' })).rejects.toThrow(
      'unsupported PHC',
    );
    expect(purchaseStoreProduct).not.toHaveBeenCalled();
    expect(purchasePackage).not.toHaveBeenCalled();
  });
}

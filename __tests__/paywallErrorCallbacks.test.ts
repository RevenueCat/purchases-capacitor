type Listener = (data: unknown) => void;
const listeners = new Map<string, Listener>();

jest.doMock(require.resolve('@capacitor/core', { paths: [`${__dirname}/../purchases-capacitor-ui`] }), () => ({
  registerPlugin: () => ({
    addListener: (eventName: string, listener: Listener) => {
      listeners.set(eventName, listener);
      return Promise.resolve({ remove: () => Promise.resolve() });
    },
    presentPaywall: () => {
      listeners.get('onPurchaseError')!({ error: rawNativeError() });
      listeners.get('onRestoreError')!({ error: rawNativeError() });
      return Promise.resolve({ result: 'NOT_PRESENTED' });
    },
  }),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { RevenueCatUI } = require('../purchases-capacitor-ui/src/index');

const rawNativeError = () => ({
  code: 1,
  message: 'Purchase was cancelled.',
  readableErrorCode: 'PURCHASE_CANCELLED',
  underlyingErrorMessage: '',
});

const expectNormalized = (callback: jest.Mock) => {
  expect(callback).toHaveBeenCalledTimes(1);
  const { error } = callback.mock.calls[0][0];
  expect(error.code).toBe('1');
  expect(error.userInfo.readableErrorCode).toBe('PURCHASE_CANCELLED');
  expect(error.readableErrorCode).toBe('PURCHASE_CANCELLED');
  expect(error.message).toBe('Purchase was cancelled.');
  expect(error.userCancelled).toBe(true);
};

describe('paywall listener errors', () => {
  it('match the PurchasesError interface', async () => {
    const onPurchaseError = jest.fn();
    const onRestoreError = jest.fn();

    await RevenueCatUI.presentPaywall({ listener: { onPurchaseError, onRestoreError } });

    expectNormalized(onPurchaseError);
    expectNormalized(onRestoreError);
  });
});

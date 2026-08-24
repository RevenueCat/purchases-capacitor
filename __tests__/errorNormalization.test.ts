import type { PurchasesError } from '@revenuecat/purchases-typescript-internal-esm';

/**
 * Mirrors the error @capacitor/core's native-bridge hands to JS: an Exception
 * carrying `code` and the reject payload under `data`.
 */
class CapacitorException extends Error {
  constructor(
    message: string,
    public code?: string,
    public data?: unknown,
  ) {
    super(message);
    this.message = message;
  }
}

const rejection = () =>
  new CapacitorException('There was a credentials issue.', '11', {
    code: 11,
    message: 'There was a credentials issue.',
    readableErrorCode: 'InvalidCredentialsError',
    readable_error_code: 'InvalidCredentialsError',
    underlyingErrorMessage: 'Invalid API Key.',
  });

jest.mock('@capacitor/core', () => ({
  registerPlugin: () => ({
    logIn: () => Promise.reject(rejection()),
    getCustomerInfo: () => Promise.resolve({ activeSubscriptions: [] }),
  }),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Purchases } = require('../src/index');

describe('errors surfaced by the Purchases plugin', () => {
  it('matches the PurchasesError interface', async () => {
    const error: PurchasesError = await Purchases.logIn({ appUserID: 'abc' }).catch((caught: unknown) => caught);

    expect(error.code).toBe('11');
    expect(error.message).toBe('There was a credentials issue.');
    expect(error.readableErrorCode).toBe('InvalidCredentialsError');
    expect(error.underlyingErrorMessage).toBe('Invalid API Key.');
    expect(error.userInfo.readableErrorCode).toBe('InvalidCredentialsError');
    expect(error.userCancelled).toBeNull();
  });

  it('is still a real Error', async () => {
    const error = await Purchases.logIn({ appUserID: 'abc' }).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(CapacitorException);
    expect(typeof error.stack).toBe('string');
  });

  it('keeps the original data payload', async () => {
    const error = await Purchases.logIn({ appUserID: 'abc' }).catch((caught: unknown) => caught);

    expect(error.data).toEqual(expect.objectContaining({ underlyingErrorMessage: 'Invalid API Key.' }));
  });

  it('leaves successful calls alone', async () => {
    await expect(Purchases.getCustomerInfo()).resolves.toEqual({ activeSubscriptions: [] });
  });
});

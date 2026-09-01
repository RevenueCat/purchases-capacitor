import type { PurchasesError } from '@revenuecat/purchases-typescript-internal-esm';

// The real class the native bridge instantiates, reached past the module mock below.
const { CapacitorException } = jest.requireActual('@capacitor/core');

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

  // Exact shape rather than individual fields, so removing or renaming anything a
  // consumer already reads fails here rather than in someone's app.
  it('exposes exactly the documented properties', async () => {
    const error = await Purchases.logIn({ appUserID: 'abc' }).catch((caught: unknown) => caught);

    const { ...ownProperties } = error as object;
    expect(ownProperties).toEqual({
      code: '11',
      // Predates the normalizer; consumers read it, so it has to stay.
      data: {
        code: 11,
        message: 'There was a credentials issue.',
        readableErrorCode: 'InvalidCredentialsError',
        readable_error_code: 'InvalidCredentialsError',
        underlyingErrorMessage: 'Invalid API Key.',
      },
      userInfo: {
        code: 11,
        message: 'There was a credentials issue.',
        readableErrorCode: 'InvalidCredentialsError',
        readable_error_code: 'InvalidCredentialsError',
        underlyingErrorMessage: 'Invalid API Key.',
      },
      readableErrorCode: 'InvalidCredentialsError',
      underlyingErrorMessage: 'Invalid API Key.',
      userCancelled: null,
    });
    expect((error as Error).message).toBe('There was a credentials issue.');
  });

  it('leaves successful calls alone', async () => {
    await expect(Purchases.getCustomerInfo()).resolves.toEqual({ activeSubscriptions: [] });
  });
});

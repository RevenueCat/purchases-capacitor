import Purchases from "../src/plugin/plugin";

const execFn = jest.fn();

window.cordova = {
  exec: execFn
};

describe("Purchases", () => {
  it("setup fires PurchasesPlugin with the correct arguments", () => {
    Purchases.setup("api_key", "app_user_id");

    expect(execFn).toHaveBeenCalledWith(
      expect.any(Function),
      null,
      "PurchasesPlugin",
      "setupPurchases",
      ["api_key", "app_user_id", false, undefined]
    );
  });

  it("setup fires PurchasesPlugin with the correct arguments when specifying observermode", () => {
    Purchases.setup("api_key", "app_user_id", true);

    expect(execFn).toHaveBeenCalledWith(
      expect.any(Function),
      null,
      "PurchasesPlugin",
      "setupPurchases",
      ["api_key", "app_user_id", true, undefined]
    );
  });

  it("setup fires PurchasesPlugin with the correct arguments when setting user defaults suite name", () => {
    const expected = "suite-name";

    Purchases.setup("api_key", "app_user_id", false, expected);

    expect(execFn).toHaveBeenCalledWith(
      expect.any(Function),
      null,
      "PurchasesPlugin",
      "setupPurchases",
      ["api_key", "app_user_id", false, expected]
    );
  });

  it("setProxyURL fires PurchasesPlugin with the correct arguments", () => {
    const expected = "https://proxy.com";
    Purchases.setProxyURL(expected);

    expect(execFn).toHaveBeenCalledWith(
      null,
      null,
      "PurchasesPlugin",
      "setProxyURLString",
      [expected]
    );
  });

  describe("canMakePayments", () => {
    describe("when no parameters are passed", () => {
      it("calls Purchases with empty list", () => {
        Purchases.canMakePayments(
          undefined,
          canPay => {},
          error => {}
        );

        expect(execFn).toHaveBeenCalledWith(
          expect.any(Function),
          expect.any(Function),
          "PurchasesPlugin",
          "canMakePayments",
          [[]]
        );
      });
    });
    describe("when empty list is passed", () => {
      it("calls Purchases with empty list", () => {
        Purchases.canMakePayments(
          [],
          canPay => {},
          error => {}
        );
        expect(execFn).toHaveBeenCalledWith(
          expect.any(Function),
          expect.any(Function),
          "PurchasesPlugin",
          "canMakePayments",
          [[]]
        );
      });
    });
    describe("when list of parameters are passed", () => {
      it("calls Purchases with list of features", () => {
        Purchases.canMakePayments(
          [Purchases.BILLING_FEATURE.SUBSCRIPTIONS],
          canPay => {},
          error => {}
        );
        expect(execFn).toHaveBeenCalledWith(
          expect.any(Function),
          expect.any(Function),
          "PurchasesPlugin",
          "canMakePayments",
          [[0]]
        );
      });
    });
    describe("when list of parameters are passed", () => {
        it("parameters are mapped successfully", () => {
          const expected = [[0, 4, 3, 1, 2]]

          Purchases.canMakePayments(
            [Purchases.BILLING_FEATURE.SUBSCRIPTIONS,
              Purchases.BILLING_FEATURE.PRICE_CHANGE_CONFIRMATION,
              Purchases.BILLING_FEATURE.SUBSCRIPTIONS_ON_VR,
              Purchases.BILLING_FEATURE.SUBSCRIPTIONS_UPDATE,
              Purchases.BILLING_FEATURE.IN_APP_ITEMS_ON_VR],
            canPay => {},
            error => {}
          );
          expect(execFn).toHaveBeenCalledWith(
            expect.any(Function),
            expect.any(Function),
            "PurchasesPlugin",
            "canMakePayments",
            expected
          );
        });
      });
  });
});

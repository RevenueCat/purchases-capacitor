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

});

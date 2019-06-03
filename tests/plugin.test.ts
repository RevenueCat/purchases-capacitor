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
      ["api_key", "app_user_id", false]
    );
  });
});

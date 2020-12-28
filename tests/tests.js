exports.defineAutoTests = function() {
  describe("Purchases (Purchases)", function() {
    beforeAll(function() {
      Purchases.setup("api_key");
    });

    it("should exist", function() {
      expect(Purchases).toBeDefined();
    });

    it("should configure without crashing", function(done) {
      Purchases.getAppUserID(
        appUserID => {
          console.log(Purchases.appUserID);
          expect(appUserID).toBeTruthy();
          done();
        },
        error => {
          done.fail("shouldn't be error");
        }
      );
    });

    it("should get purchaser info", function(done) {
      Purchases.getPurchaserInfo(
        info => {
          expect(info).toBeTruthy();
          done();
        },
        error => {
          done.fail("shouldn't be error");
        }
      );
    }, 10000);
  });
};

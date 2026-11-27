import Capacitor
import PurchasesHybridCommon
import XCTest

@testable import RevenuecatPurchasesCapacitor

final class RejectWithErrorContainerTests: XCTestCase {

    func testPayloadSitsUnderExactlyOneDataLevel() throws {
        let rejection = try reject(container())

        // CAPPluginCallError wraps the reject argument under "data" itself, so passing an
        // already wrapped payload buries it one level below where the JS layer reads it.
        let payload = try XCTUnwrap(rejection.data?["data"] as? [String: Any])

        XCTAssertNil(payload["data"], "the payload is nested twice")
        XCTAssertEqual(payload["code"] as? Int, 11)
        XCTAssertEqual(payload["message"] as? String, "There was a credentials issue.")
        XCTAssertEqual(payload["readableErrorCode"] as? String, "INVALID_CREDENTIALS")
    }

    func testMessageAndCodeTravelOutsideThePayload() throws {
        let rejection = try reject(container())

        XCTAssertEqual(rejection.code, "11")
        XCTAssertEqual(rejection.message, "There was a credentials issue.")
    }

    private func container() -> ErrorContainer {
        let error = NSError(domain: "RevenueCat.ErrorCode",
                            code: 11,
                            userInfo: [NSLocalizedDescriptionKey: "There was a credentials issue.",
                                       "readable_error_code": "INVALID_CREDENTIALS"])
        return ErrorContainer(error: error, extraPayload: [:])
    }

    private func reject(_ container: ErrorContainer) throws -> CAPPluginCallError {
        var rejection: CAPPluginCallError?
        let call = try XCTUnwrap(CAPPluginCall(callbackId: "test",
                                               methodName: "getOfferings",
                                               options: [:],
                                               success: { _, _ in XCTFail("resolved instead of rejecting") },
                                               error: { rejection = $0 }))

        PurchasesPlugin().rejectWithErrorContainer(call, error: container)

        return try XCTUnwrap(rejection)
    }
}

final class IntroductoryOfferEligibilityParameterTests: XCTestCase {
    func testAbsentTokensKeepExistingPath() throws {
        for options: [String: Any] in [[:], ["introductoryOfferEligibilityJWS": NSNull()]] {
            let call = try XCTUnwrap(CAPPluginCall(callbackId: "test", methodName: "purchasePackage", options: options,
                success: { _, _ in XCTFail("unexpected purchase") }, error: { _ in XCTFail("unexpected rejection") }))
            XCTAssertFalse(PurchasesPlugin().purchaseWithIntroductoryOfferEligibilityJWSIfPresent(call, options: [:]))
        }
    }

    func testMalformedTokensRejectWithoutFallingBack() throws {
        for value: Any in ["", 123, false, ["token"]] {
            var error: CAPPluginCallError?
            let call = try XCTUnwrap(CAPPluginCall(callbackId: "test", methodName: "purchaseStoreProduct",
                options: ["introductoryOfferEligibilityJWS": value],
                success: { _, _ in XCTFail("unexpected purchase") }, error: { error = $0 }))
            XCTAssertTrue(PurchasesPlugin().purchaseWithIntroductoryOfferEligibilityJWSIfPresent(call, options: [:]))
            XCTAssertNotNil(error?.code)
        }
    }
}

final class IntroductoryOfferEligibilityDispatchTests: XCTestCase {
    private final class DispatchSpy: PurchasesPlugin {
        var itemType: String?
        override func purchaseStoreProduct(_ call: CAPPluginCall) { itemType = "product" }
        override func purchasePackage(_ call: CAPPluginCall) { itemType = "package" }
    }

    func testDispatchUsesRequestedTypeEvenWhenBothItemsArePresent() throws {
        for itemType in ["product", "package"] {
            let plugin = DispatchSpy()
            let call = try XCTUnwrap(CAPPluginCall(callbackId: "test", methodName: "purchaseWithIntroductoryOfferEligibilityJWS",
                options: ["introductoryOfferEligibilityJWS": "header.deny.signature", "purchasableItemType": itemType,
                          "product": ["identifier": "product"] as JSObject,
                          "aPackage": ["identifier": "monthly"] as JSObject],
                success: { _, _ in XCTFail("unexpected purchase") }, error: { XCTFail("unexpected rejection: \($0?.message ?? "unknown")") }))
            plugin.purchaseWithIntroductoryOfferEligibilityJWS(call)
            XCTAssertEqual(plugin.itemType, itemType)
        }
    }

    func testMissingRequestedItemDoesNotFallBackToAnotherKind() throws {
        for itemType in ["product", "package"] {
            var rejection: CAPPluginCallError?
            let plugin = DispatchSpy()
            let otherKey = itemType == "product" ? "aPackage" : "product"
            let call = try XCTUnwrap(CAPPluginCall(callbackId: "test", methodName: "purchaseWithIntroductoryOfferEligibilityJWS",
                options: ["introductoryOfferEligibilityJWS": "header.deny.signature", "purchasableItemType": itemType,
                          otherKey: ["identifier": "other"] as JSObject],
                success: { _, _ in XCTFail("unexpected purchase") }, error: { rejection = $0 }))
            plugin.purchaseWithIntroductoryOfferEligibilityJWS(call)
            XCTAssertNotNil(rejection)
            XCTAssertNil(plugin.itemType)
        }
    }
}

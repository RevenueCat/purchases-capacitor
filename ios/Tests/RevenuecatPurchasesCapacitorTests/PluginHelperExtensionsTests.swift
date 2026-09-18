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

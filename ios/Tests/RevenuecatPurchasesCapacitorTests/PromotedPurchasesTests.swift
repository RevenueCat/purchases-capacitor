import Capacitor
import RevenueCat
import XCTest

@testable import RevenuecatPurchasesCapacitor

final class PromotedPurchasesTests: XCTestCase {
    private var calls: [CAPPluginCall] = []

    override func tearDown() {
        calls.removeAll()
        super.tearDown()
    }

    func testReleasingBridgeOwnedListenersAllowsLateReplayWithoutCallingOldPage() throws {
        let plugin = PurchasesPlugin()
        var events = 0
        var listener: CAPPluginCall? = try call("old-page", success: { _ in events += 1 })
        weak var released = listener
        plugin.addShouldPurchasePromoProductListener(try XCTUnwrap(listener))
        drainMainQueue()
        listener = nil
        calls.removeAll() // Simulates the bridge clearing saved calls on WebView navigation.
        XCTAssertNil(released)
        plugin.receivePromotedPurchase { _ in XCTFail("Unexpected purchase") }
        drainMainQueue()
        XCTAssertEqual(events, 0)
        plugin.addShouldPurchasePromoProductListener(try call("new-page", success: { _ in events += 1 }))
        drainMainQueue()
        XCTAssertEqual(events, 1)
    }

    func testLateListenersReplayTheSameUnconsumedPurchaseAndRemovalKeepsItPending() throws {
        let plugin = PurchasesPlugin()
        var starts = 0
        plugin.receivePromotedPurchase { _ in starts += 1 }
        var firstIDs: [String] = []
        let first = try call("first", success: {
            if let callbackID = $0["callbackID"] as? String { firstIDs.append(callbackID) }
        })
        plugin.addShouldPurchasePromoProductListener(first)
        drainMainQueue()
        XCTAssertEqual(firstIDs.count, 1)
        XCTAssertEqual(starts, 0)

        var removed: Bool?
        let removal = try call("remove", options: ["listenerToRemove": "first"], success: {
            removed = $0["wasRemoved"] as? Bool
        })
        plugin.removeShouldPurchasePromoProductListener(removal)
        var secondIDs: [String] = []
        plugin.addShouldPurchasePromoProductListener(try call("second", success: {
            guard let callbackID = $0["callbackID"] as? String else { return XCTFail("Missing callback ID") }
            secondIDs.append(callbackID)
        }))
        plugin.receivePromotedPurchase { _ in starts += 1 }
        drainMainQueue()
        XCTAssertEqual(removed, true)
        XCTAssertFalse(first.keepAlive)
        XCTAssertEqual(firstIDs.count, 1)
        XCTAssertEqual(secondIDs.first, firstIDs.first)
        XCTAssertEqual(secondIDs.count, 2)
        XCTAssertEqual(Set(secondIDs).count, 2)
        XCTAssertEqual(starts, 0)
    }

    func testConsumptionIsAtomicAcrossListenersAndCancelledPurchasesAreNotReplayed() throws {
        let plugin = PurchasesPlugin()
        var starts = 0
        var callbackID: String?
        plugin.addShouldPurchasePromoProductListener(try call("listener", success: {
            callbackID = $0["callbackID"] as? String
        }))
        plugin.receivePromotedPurchase { completion in
            XCTAssertTrue(Thread.isMainThread)
            starts += 1
            DispatchQueue.main.async { completion(nil, nil, NSError(domain: "RevenueCat.ErrorCode", code: 1), true) }
        }
        drainMainQueue()
        let options = ["callbackID": try XCTUnwrap(callbackID)]
        var errors: [CAPPluginCallError] = []
        let rejected = expectation(description: "both calls rejected")
        rejected.expectedFulfillmentCount = 2
        let requests = try (0..<2).map { index in
            try call("purchase-\(index)", options: options, error: { errors.append($0); rejected.fulfill() })
        }
        DispatchQueue.concurrentPerform(iterations: requests.count) { index in
            plugin.makeDeferredPurchase(requests[index])
        }
        wait(for: [rejected], timeout: 2)
        XCTAssertEqual(starts, 1)
        XCTAssertEqual(errors.count, 2)
        XCTAssertTrue(errors.contains { ($0.data?["data"] as? [String: Any])?["userCancelled"] as? Bool == true })
        XCTAssertTrue(errors.contains { $0.message.contains("No pending promoted purchase") })
        let lateListener = try call("late", success: { _ in XCTFail("Consumed purchase replayed") })
        plugin.addShouldPurchasePromoProductListener(lateListener)
        drainMainQueue()
    }

    func testUnknownOrMissingCallbackIDRejects() throws {
        let plugin = PurchasesPlugin()
        var errors = 0
        let unknown = try call("unknown", options: ["callbackID": "missing"], error: { _ in errors += 1 })
        plugin.makeDeferredPurchase(unknown)
        plugin.makeDeferredPurchase(try call("missing", error: { _ in errors += 1 }))
        drainMainQueue()
        XCTAssertEqual(errors, 2)
    }

    private func drainMainQueue() {
        let drained = expectation(description: "main queue drained")
        DispatchQueue.main.async { drained.fulfill() }
        wait(for: [drained], timeout: 2)
    }

    private func call(_ id: String, options: [String: Any] = [:],
                      error: @escaping (CAPPluginCallError) -> Void = { _ in XCTFail("Unexpected rejection") },
                      success: @escaping ([String: Any]) -> Void = { _ in XCTFail("Unexpected resolution") }
    ) throws -> CAPPluginCall {
        let call = try XCTUnwrap(CAPPluginCall(
            callbackId: id, methodName: "test", options: options,
            success: { result, _ in success(result?.data ?? [:]) },
            error: { rejection in
                if let rejection { error(rejection) } else { XCTFail("Missing error") }
            }
        ))
        calls.append(call)
        return call
    }
}

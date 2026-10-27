import XCTest

final class CheckpointSmoke: XCTestCase {
    func testDOMErrorAboveNativeModalAndRestoration() {
        let app = XCUIApplication(bundleIdentifier: "com.revenuecat.purchase_tester")
        app.launch()
        let checkpoints = app.descendants(matching: .any).matching(NSPredicate(format: "label ==[c] %@", "Checkpoints")).firstMatch
        XCTAssertTrue(checkpoints.waitForExistence(timeout: 20), app.debugDescription)
        checkpoints.tap()
        let probe = app.descendants(matching: .any).matching(NSPredicate(format: "label CONTAINS[c] %@", "Test error host (synthetic modal)")).firstMatch
        XCTAssertTrue(probe.waitForExistence(timeout: 10), app.debugDescription)
        app.buttons["Run checkpoint"].firstMatch.tap()
        let setupFailure = app.staticTexts.matching(NSPredicate(format: "label CONTAINS %@", "Configure Purchases before calling a checkpoint")).firstMatch
        XCTAssertTrue(setupFailure.waitForExistence(timeout: 10), app.debugDescription)
        for iteration in 1...3 {
            probe.tap()
            let title = app.staticTexts["App-owned DOM error"].firstMatch
            XCTAssertTrue(title.waitForExistence(timeout: 10), app.debugDescription)
            let attachment = XCTAttachment(screenshot: app.screenshot())
            attachment.name = "ios-custom-dom-error-\(iteration)"
            attachment.lifetime = .keepAlways
            add(attachment)
            let acknowledge = app.buttons["Acknowledge error"].firstMatch
            XCTAssertTrue(acknowledge.waitForExistence(timeout: 5), app.debugDescription)
            acknowledge.tap()
            XCTAssertTrue(probe.waitForExistence(timeout: 10), app.debugDescription)
        }
        let restored = XCTAttachment(screenshot: app.screenshot())
        restored.name = "ios-restored-webview"
        restored.lifetime = .keepAlways
        add(restored)
    }
}

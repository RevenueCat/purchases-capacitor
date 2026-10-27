// Throwaway spike. Moves the existing Capacitor WebView above native checkpoint UI.
import Capacitor
import UIKit
import WebKit
import PurchasesHybridCommon
@_spi(InviteOnlyCheckpointsApi) import RevenueCatUI

@available(iOS 15.0, *)
@MainActor
final class CheckpointErrorBridge {
    private weak var plugin: RevenueCatUIPlugin?
    private struct Pending {
        let callId: String
        let complete: () -> Void
    }
    private var pending: [String: Pending] = [:]
    private var activeCalls: Set<String> = []
    private var host: CheckpointWebViewHost?
    private var owner: String?

    init(plugin: RevenueCatUIPlugin) { self.plugin = plugin }

    func handler(callId: String) -> ErrorPresentationHandler {
        activeCalls.insert(callId)
        return { [weak self] params, completion in
            guard let self, self.activeCalls.contains(callId) else { completion.complete(); return }
            let kind: String
            switch params.kind {
            case .flowCouldNotBeShown: kind = "flowCouldNotBeShown"
            case .flowActionFailed: kind = "flowActionFailed"
            case .flowResultSyncFailed: kind = "flowResultSyncFailed"
            default: kind = "flowActionFailed"
            }
            self.emit(callId: callId, kind: kind,
                      error: ErrorContainer(error: params.error, extraPayload: [:]).info,
                      complete: { completion.complete() })
        }
    }

    private func emit(callId: String, kind: String, error: [String: Any], complete: @escaping () -> Void) {
        let requestId = UUID().uuidString
        pending[requestId] = Pending(callId: callId, complete: complete)
        plugin?.notifyListeners("checkpointError", data: [
            "callId": callId, "requestId": requestId, "kind": kind, "error": error
        ])
    }

    func show(callId: String, requestId: String, call: CAPPluginCall) {
        NSLog("[CheckpointSpike] show pending=%d host=%@ webView=%@ parent=%@", pending.count,
              String(host != nil), String(plugin?.bridge?.webView != nil), String(plugin?.bridge?.webView?.superview != nil))
        guard pending[requestId]?.callId == callId,
              host == nil, let webView = plugin?.bridge?.webView,
              var presenter = plugin?.bridge?.viewController else {
            call.reject("No pending error or WebView host is already in use", "ERROR_HOST_FAILED")
            return
        }
        while let presented = presenter.presentedViewController { presenter = presented }
        guard !presenter.isBeingDismissed else {
            call.reject("The native presenter is being dismissed", "ERROR_HOST_FAILED")
            return
        }
        let host = CheckpointWebViewHost(webView: webView, rootController: plugin?.bridge?.viewController)
        self.host = host
        owner = requestId
        host.modalPresentationStyle = .overFullScreen
        host.isModalInPresentation = true
        presenter.present(host, animated: false) {
            NSLog("[CheckpointSpike] error host presented")
            call.resolve()
        }
    }

    func complete(callId: String, requestId: String, done: @escaping () -> Void) {
        NSLog("[CheckpointSpike] complete pending=%d host=%@", pending.count, String(host != nil))
        guard let request = pending[requestId], request.callId == callId else { done(); return }
        pending.removeValue(forKey: requestId)
        if owner == requestId, let host {
            self.host = nil
            owner = nil
            host.restore()
            host.dismiss(animated: false) { request.complete(); done() }
        } else {
            request.complete()
            done()
        }
    }

    func cancel(callId: String, done: @escaping () -> Void) {
        activeCalls.remove(callId)
        let ids = pending.filter { $0.value.callId == callId }.map(\.key)
        guard !ids.isEmpty else { done(); return }
        // The native SDK serializes error presentations, so a call has at most one visible host.
        var remaining = ids.count
        ids.forEach { id in complete(callId: callId, requestId: id) { remaining -= 1; if remaining == 0 { done() } } }
    }

    func probe(callId: String, fullScreen: Bool) {
        guard let parent = plugin?.bridge?.viewController, parent.presentedViewController == nil else { return }
        activeCalls.insert(callId)
        let controller = UIViewController()
        controller.view.backgroundColor = .systemBlue
        let label = UILabel()
        label.text = "Synthetic native modal\nCustom DOM error will appear above this"
        label.numberOfLines = 0
        label.textColor = .white
        label.textAlignment = .center
        label.frame = CGRect(x: 24, y: 110, width: controller.view.bounds.width - 48, height: 100)
        label.autoresizingMask = [.flexibleWidth, .flexibleBottomMargin]
        controller.view.addSubview(label)
        controller.modalPresentationStyle = fullScreen ? .fullScreen : .pageSheet
        parent.present(controller, animated: false) { [weak self] in
            guard let self, self.activeCalls.contains(callId) else {
                controller.dismiss(animated: false)
                return
            }
            self.emit(callId: callId, kind: "flowActionFailed", error: [
                "code": 0, "message": "Synthetic error. This proves WebView layering, not a real purchase failure.",
                "readableErrorCode": "UNKNOWN_ERROR"
            ]) { [weak controller] in
                controller?.dismiss(animated: false)
            }
        }
    }
}

@available(iOS 15.0, *)
@MainActor
private final class CheckpointWebViewHost: UIViewController {
    private let webView: WKWebView
    private let originalParent: UIView?
    private weak var rootController: UIViewController?
    private let originalIndex: Int
    private let originalFrame: CGRect
    private let originalAutoresizing: UIView.AutoresizingMask
    private let originalTranslates: Bool
    private let originalConstraints: [NSLayoutConstraint]
    private let originalOpaque: Bool
    private let originalBackground: UIColor?
    private let originalScrollBackground: UIColor?
    private var hostConstraints: [NSLayoutConstraint] = []

    init(webView: WKWebView, rootController: UIViewController?) {
        self.webView = webView
        originalParent = webView.superview
        self.rootController = rootController?.viewIfLoaded === webView ? rootController : nil
        originalIndex = originalParent?.subviews.firstIndex(of: webView) ?? 0
        originalFrame = webView.frame
        originalAutoresizing = webView.autoresizingMask
        originalTranslates = webView.translatesAutoresizingMaskIntoConstraints
        originalConstraints = originalParent?.constraints.filter {
            ($0.firstItem as? UIView) === webView || ($0.secondItem as? UIView) === webView
        } ?? []
        originalOpaque = webView.isOpaque
        originalBackground = webView.backgroundColor
        originalScrollBackground = webView.scrollView.backgroundColor
        super.init(nibName: nil, bundle: nil)
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .clear
        NSLayoutConstraint.deactivate(originalConstraints)
        // Capacitor uses WKWebView as its controller's root view. UIKit detaches that
        // root under a full-screen flow, so it may have no superview at error time.
        if let rootController {
            let placeholder = UIView(frame: webView.frame)
            placeholder.backgroundColor = .clear
            rootController.view = placeholder
        }
        webView.removeFromSuperview()
        webView.isOpaque = false
        webView.backgroundColor = .clear
        webView.scrollView.backgroundColor = .clear
        view.addSubview(webView)
        webView.translatesAutoresizingMaskIntoConstraints = false
        hostConstraints = [webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
                           webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
                           webView.topAnchor.constraint(equalTo: view.topAnchor),
                           webView.bottomAnchor.constraint(equalTo: view.bottomAnchor)]
        NSLayoutConstraint.activate(hostConstraints)
    }

    func restore() {
        NSLayoutConstraint.deactivate(hostConstraints)
        webView.removeFromSuperview()
        if let rootController {
            rootController.view = webView
        }
        if let originalParent, webView.superview == nil {
            originalParent.insertSubview(webView, at: min(originalIndex, originalParent.subviews.count))
        }
        webView.translatesAutoresizingMaskIntoConstraints = originalTranslates
        webView.frame = originalFrame
        webView.autoresizingMask = originalAutoresizing
        webView.isOpaque = originalOpaque
        webView.backgroundColor = originalBackground
        webView.scrollView.backgroundColor = originalScrollBackground
        NSLayoutConstraint.activate(originalConstraints)
    }
}

extension RevenueCatUIPlugin {
    @MainActor var errorBridge: CheckpointErrorBridge {
        if let existing = checkpointErrorBridge as? CheckpointErrorBridge { return existing }
        let bridge = CheckpointErrorBridge(plugin: self)
        checkpointErrorBridge = bridge
        return bridge
    }

    @objc func showCheckpointError(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.errorBridge.show(callId: call.getString("callId") ?? "", requestId: call.getString("requestId") ?? "", call: call)
        }
    }

    @objc func completeCheckpointError(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.errorBridge.complete(callId: call.getString("callId") ?? "", requestId: call.getString("requestId") ?? "") { call.resolve() }
        }
    }

    @objc func cancelCheckpointErrors(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.errorBridge.cancel(callId: call.getString("callId") ?? "") { call.resolve() }
        }
    }
}

import Foundation
import Capacitor
import PurchasesHybridCommonUI

extension RevenueCatUIPlugin {
    @objc func checkpoint(_ call: CAPPluginCall) {
        DispatchQueue.main.async { [weak self] in
            guard let self else {
                call.reject("Plugin instance was deallocated", "CHECKPOINT_ERROR")
                return
            }
            guard let identifier = call.getString("identifier"),
                  let callId = call.getString("callId") else {
                call.reject("Missing checkpoint identifier or callId", "BAD_ARGS")
                return
            }
#if targetEnvironment(macCatalyst)
            call.reject("Checkpoints require iOS", "UNSUPPORTED_PLATFORM")
#else
            var setupFailed = false
            CheckpointProxy.present(
                identifier: identifier,
                customVariables: call.getObject("customVariables"),
                presentationMode: call.getString("presentationMode"),
                onPassed: { [weak self] result in
                    self?.notifyListeners("checkpointPassed", data: ["callId": callId, "result": result])
                },
                onError: { code, message in
                    setupFailed = true
                    call.reject(message, code)
                }
            )
            // PHC reports startup failures synchronously. Passing the checkpoint is a separate event.
            if !setupFailed { call.resolve() }
#endif
        }
    }
}

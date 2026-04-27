import Capacitor

@objc(LaunchArgsPlugin)
public class LaunchArgsPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "LaunchArgsPlugin"
    public let jsName = "LaunchArgs"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getTestFlow", returnType: CAPPluginReturnPromise)
    ]

    @objc func getTestFlow(_ call: CAPPluginCall) {
        let testFlow = UserDefaults.standard.string(forKey: "e2e_test_flow")
        call.resolve(["value": testFlow as Any])
    }
}

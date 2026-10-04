// Created by Antonio Pallares. Copyright (c) 2026 RevenueCat, Inc.
import UIKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        return true
    }

    func application(_ application: UIApplication,
                     configurationForConnecting connectingSceneSession: UISceneSession,
                     options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        let configuration = UISceneConfiguration(name: "Default Configuration",
                                                sessionRole: connectingSceneSession.role)
        configuration.delegateClass = SceneDelegate.self
        return configuration
    }
}

class SDKUpdateBridgeViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(LaunchArgsPlugin())
    }
}

@objc(LaunchArgsPlugin)
class LaunchArgsPlugin: CAPPlugin, CAPBridgedPlugin {
    let identifier = "LaunchArgsPlugin"
    let jsName = "LaunchArgs"
    let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getLaunchArguments", returnType: CAPPluginReturnPromise)
    ]

    @objc func getLaunchArguments(_ call: CAPPluginCall) {
        let arguments = ProcessInfo.processInfo.arguments
        let index = arguments.firstIndex(of: "-app_user_id_to_log_in")
        let appUserID = index.flatMap { $0 + 1 < arguments.count ? arguments[$0 + 1] : nil }
        call.resolve(["appUserID": appUserID as Any])
    }
}

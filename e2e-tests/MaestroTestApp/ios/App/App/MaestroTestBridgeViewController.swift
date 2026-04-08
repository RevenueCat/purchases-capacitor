import UIKit
import Capacitor

class MaestroTestBridgeViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(LaunchArgsPlugin())
    }
}

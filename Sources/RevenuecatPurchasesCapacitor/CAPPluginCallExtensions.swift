import Foundation
import Capacitor

internal extension CAPPluginCall {

    func getOrRejectString(_ parameterName: String) -> String? {
        guard let parameter = self.getString(parameterName) else {
            self.reject("Must provide \(parameterName) parameter")
            return nil
        }
        return parameter
    }

    func getOrRejectBool(_ parameterName: String) -> Bool? {
        guard let parameter = self.getBool(parameterName) else {
            self.reject("Must provide \(parameterName) parameter")
            return nil
        }
        return parameter
    }

    func getOrRejectStringArray(_ parameterName: String) -> [String]? {
        guard let parameter = self.getArray(parameterName) as? [String] else {
            self.reject("Must provide \(parameterName) parameter")
            return nil
        }
        return parameter
    }

    func getOrRejectObject(_ parameterName: String) -> JSObject? {
        guard let parameter = self.getObject(parameterName) else {
            self.reject("Must provide \(parameterName) parameter")
            return nil
        }
        return parameter
    }
}

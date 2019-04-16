## 0.0.8

- Updates iOS SDK to 2.1.1

## 0.0.7

- Fixes exception on iOS when sending an error

## 0.0.6

- Fixes errors in Android not being sent as int
- Fixes crash when underlyingErrorMessage is missing

## 0.0.5

- Updates versions to 2.1.0 with the new error handling.
- **Breaking** change, the errors have changed and now return an underlyingErrorMessage instead of the domain.
- Removes the preinstall hook that was causing errors in Windows. 0.0.4 version was broken for some. The iOS framework will be included in the repo from now on.
- **Breaking** the error callback of makePurchase now returns an error and a boolean indicating if the user cancelled.

## 0.0.4

- Fixes windows by skipping installation of iOS download script if not building for iOS.

## 0.0.3

- Removes `onDestroy` Android's Activity lifecycle hook since it was closing the instance.

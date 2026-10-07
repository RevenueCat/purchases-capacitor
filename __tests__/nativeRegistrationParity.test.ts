import { readFileSync } from 'fs';
import { join } from 'path';

// Every method the TypeScript API declares as returning a Promise must be registered natively
// as a Promise (or Callback) method. A ReturnNone registration makes Capacitor resolve the
// JS Promise immediately with "-1", before native code runs, and drops any native rejection.
const read = (relativePath: string) => readFileSync(join(__dirname, '..', relativePath), 'utf8');

describe('native plugin method registrations', () => {
  it('registers no ReturnNone methods on iOS', () => {
    const swift = read('ios/Sources/RevenuecatPurchasesCapacitor/PurchasesPlugin.swift');
    expect(swift).not.toContain('CAPPluginReturnNone');
  });

  it('registers no RETURN_NONE methods on Android', () => {
    const kotlin = read('android/src/main/java/com/revenuecat/purchases/capacitor/PurchasesPlugin.kt');
    expect(kotlin).not.toContain('RETURN_NONE');
  });
});

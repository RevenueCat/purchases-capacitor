import { WebPlugin } from '@capacitor/core';

import type { CapacitorPurchasesPlugin } from './definitions';

export class CapacitorPurchasesWeb
  extends WebPlugin
  implements CapacitorPurchasesPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}

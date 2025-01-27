import { registerPlugin } from '@capacitor/core';

import type { PurchasesPlugin } from './definitions';

const Purchases = registerPlugin<PurchasesPlugin>('Purchases', {
  web: () => import('./web').then((m) => new m.PurchasesWeb()),
});

export * from './definitions';
export { Purchases };

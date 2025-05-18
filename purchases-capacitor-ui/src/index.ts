import { registerPlugin } from '@capacitor/core';

import type { RevenueCatUIPlugin } from './definitions';

const RevenueCatUI = registerPlugin<RevenueCatUIPlugin>('RevenueCatUI', {
  web: () => import('./web').then(m => new m.RevenueCatUIWeb()),
});

export * from './definitions';
export { RevenueCatUI }; 
import { registerPlugin } from "@capacitor/core";

import type { CapacitorPurchasesPlugin } from "./definitions";

const CapacitorPurchases = registerPlugin<CapacitorPurchasesPlugin>(
  "CapacitorPurchases",
  {
    web: () => import("./web").then((m) => new m.CapacitorPurchasesWeb()),
  }
);

export * from "./definitions";
export { CapacitorPurchases };

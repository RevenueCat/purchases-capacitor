export interface CapacitorPurchasesPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.revenuecat.purchase_tester',
  appName: 'purchase-tester',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;

// Created by Antonio Pallares. Copyright (c) 2026 RevenueCat, Inc.
import { registerPlugin } from '@capacitor/core';
import { LOG_LEVEL, Purchases } from '@revenuecat/purchases-capacitor';
import type { CustomerInfo, PurchasesPackage } from '@revenuecat/purchases-capacitor';

import config from './build-config.json';

interface State {
  sdkVersion: string;
  appUserID: string;
  entitlements: string;
  screen: 'home' | 'purchase';
  canLogIn: boolean;
  busy: boolean;
  error: string;
}

interface LaunchArgsPlugin {
  getLaunchArguments(): Promise<{ appUserID: string | null }>;
}

const LaunchArgs = registerPlugin<LaunchArgsPlugin>('LaunchArgs');
const app = document.getElementById('app')!;
const state: State = {
  sdkVersion: config.sdkVersion,
  appUserID: 'Loading...',
  entitlements: 'Loading...',
  screen: 'home',
  canLogIn: false,
  busy: true,
  error: '',
};
let loginID: string | null = null;
let monthly: PurchasesPackage | null = null;

function render() {
  app.replaceChildren();
  const label = (text: string, heading = false) => {
    const element = document.createElement(heading ? 'h1' : 'p');
    element.textContent = text;
    app.append(element);
  };
  const button = (text: string, action: string) => {
    const element = document.createElement('button');
    element.textContent = text;
    element.disabled = state.busy;
    element.addEventListener('click', () => void perform(action));
    app.append(element);
  };
  if (state.screen === 'purchase') {
    label('Purchase subscription', true);
    label(`Entitlements: ${state.entitlements}`);
    button('Purchase', 'purchase');
    button('Back', 'back');
  } else {
    label('SDK Update Tester', true);
    label(`RevenueCat SDK ${state.sdkVersion}`);
    label(`App User ID: ${state.appUserID}`);
    if (state.canLogIn) button('Log in', 'log_in');
    button('Purchase screen', 'purchase_screen');
  }
  if (state.error) label(state.error);
}

function updateCustomerInfo(info: CustomerInfo) {
  state.entitlements = Object.keys(info.entitlements.active).sort().join(', ') || 'None';
}

async function perform(action: string) {
  if (state.busy) return;
  state.busy = true;
  state.error = '';
  try {
    if (action === 'purchase_screen') {
      state.screen = 'purchase';
      state.entitlements = 'Loading...';
      render();
      const [offerings, result] = await Promise.all([Purchases.getOfferings(), Purchases.getCustomerInfo()]);
      monthly = offerings.all.no_paywall?.monthly ?? null;
      if (
        !monthly ||
        monthly.identifier !== '$rc_monthly' ||
        monthly.product.identifier !== 'pro_monthly_subscription'
      ) {
        throw new Error('no_paywall must provide the monthly pro_monthly_subscription package');
      }
      updateCustomerInfo(result.customerInfo);
    } else if (action === 'log_in' && loginID) {
      const result = await Purchases.logIn({ appUserID: loginID });
      state.appUserID = (await Purchases.getAppUserID()).appUserID;
      updateCustomerInfo(result.customerInfo);
    } else if (action === 'purchase' && monthly) {
      const result = await Purchases.purchasePackage({ aPackage: monthly });
      updateCustomerInfo(result.customerInfo);
    } else if (action === 'back') {
      state.screen = 'home';
    }
  } catch (error) {
    state.error = error instanceof Error ? error.message : String(error);
  } finally {
    state.busy = false;
    render();
  }
}

async function initialize() {
  try {
    loginID = (await LaunchArgs.getLaunchArguments()).appUserID;
    state.canLogIn = Boolean(loginID);
    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
    await Purchases.configure({ apiKey: config.apiKey });
    state.appUserID = (await Purchases.getAppUserID()).appUserID;
  } catch (error) {
    state.error = error instanceof Error ? error.message : String(error);
  } finally {
    state.busy = false;
    render();
  }
}

void initialize();

import {
  BILLING_FEATURE,
  INTRO_ELIGIBILITY_STATUS,
  PACKAGE_TYPE,
  PRODUCT_CATEGORY,
  PRODUCT_TYPE,
  PRORATION_MODE,
  PURCHASE_TYPE,
  REFUND_REQUEST_STATUS,
  OFFER_PAYMENT_MODE,
  PAYWALL_RESULT,
  PERIOD_UNIT,
  RECURRENCE_MODE,
  LOG_LEVEL,
  IN_APP_MESSAGE_TYPE,
  ENTITLEMENT_VERIFICATION_MODE,
  PURCHASES_ARE_COMPLETED_BY_TYPE,
  STOREKIT_VERSION,
  VERIFICATION_RESULT,
  WebPurchaseRedemptionResultType,
} from '@revenuecat/purchases-capacitor';

function checkBillingFeature(feature: BILLING_FEATURE): boolean {
  switch (feature) {
    case BILLING_FEATURE.SUBSCRIPTIONS:
      return true;
    case BILLING_FEATURE.SUBSCRIPTIONS_UPDATE:
      return true;
    case BILLING_FEATURE.IN_APP_ITEMS_ON_VR:
      return true;
    case BILLING_FEATURE.SUBSCRIPTIONS_ON_VR:
      return true;
    case BILLING_FEATURE.PRICE_CHANGE_CONFIRMATION:
      return true;
  }
}

function checkPackageType(type: PACKAGE_TYPE): boolean {
  switch (type) {
    case PACKAGE_TYPE.UNKNOWN:
      return true;
    case PACKAGE_TYPE.CUSTOM:
      return true;
    case PACKAGE_TYPE.LIFETIME:
      return true;
    case PACKAGE_TYPE.ANNUAL:
      return true;
    case PACKAGE_TYPE.SIX_MONTH:
      return true;
    case PACKAGE_TYPE.THREE_MONTH:
      return true;
    case PACKAGE_TYPE.TWO_MONTH:
      return true;
    case PACKAGE_TYPE.MONTHLY:
      return true;
    case PACKAGE_TYPE.WEEKLY:
      return true;
  }
}

function checkIntroEligibilityStatus(status: INTRO_ELIGIBILITY_STATUS): boolean {
  switch (status) {
    case INTRO_ELIGIBILITY_STATUS.INTRO_ELIGIBILITY_STATUS_UNKNOWN:
      return true;
    case INTRO_ELIGIBILITY_STATUS.INTRO_ELIGIBILITY_STATUS_INELIGIBLE:
      return true;
    case INTRO_ELIGIBILITY_STATUS.INTRO_ELIGIBILITY_STATUS_ELIGIBLE:
      return true;
    case INTRO_ELIGIBILITY_STATUS.INTRO_ELIGIBILITY_STATUS_NO_INTRO_OFFER_EXISTS:
      return true;
  }
}

function checkProrationMode(mode: PRORATION_MODE): boolean {
  switch (mode) {
    case PRORATION_MODE.UNKNOWN_SUBSCRIPTION_UPGRADE_DOWNGRADE_POLICY:
      return true;
    case PRORATION_MODE.IMMEDIATE_WITH_TIME_PRORATION:
      return true;
    case PRORATION_MODE.IMMEDIATE_AND_CHARGE_PRORATED_PRICE:
      return true;
    case PRORATION_MODE.IMMEDIATE_WITHOUT_PRORATION:
      return true;
    case PRORATION_MODE.DEFERRED:
      return true;
    case PRORATION_MODE.IMMEDIATE_AND_CHARGE_FULL_PRICE:
      return true;
  }
}

function checkRefundRequestStatus(status: REFUND_REQUEST_STATUS): boolean {
  switch (status) {
    case REFUND_REQUEST_STATUS.SUCCESS:
      return true;
    case REFUND_REQUEST_STATUS.USER_CANCELLED:
      return true;
    case REFUND_REQUEST_STATUS.ERROR:
      return true;
  }
}

function checkProductCategory(category: PRODUCT_CATEGORY): boolean {
  switch (category) {
    case PRODUCT_CATEGORY.NON_SUBSCRIPTION:
      return true;
    case PRODUCT_CATEGORY.SUBSCRIPTION:
      return true;
    case PRODUCT_CATEGORY.UNKNOWN:
      return true;
  }
}

function checkOfferPaymentMode(mode: OFFER_PAYMENT_MODE): boolean {
  switch (mode) {
    case OFFER_PAYMENT_MODE.FREE_TRIAL:
      return true;
    case OFFER_PAYMENT_MODE.SINGLE_PAYMENT:
      return true;
    case OFFER_PAYMENT_MODE.DISCOUNTED_RECURRING_PAYMENT:
      return true;
  }
}

function checkPeriodUnit(unit: PERIOD_UNIT): boolean {
  switch (unit) {
    case PERIOD_UNIT.DAY:
      return true;
    case PERIOD_UNIT.WEEK:
      return true;
    case PERIOD_UNIT.MONTH:
      return true;
    case PERIOD_UNIT.YEAR:
      return true;
    case PERIOD_UNIT.UNKNOWN:
      return true;
  }
}

function checkRecurrenceMode(mode: RECURRENCE_MODE): boolean {
  switch (mode) {
    case RECURRENCE_MODE.INFINITE_RECURRING:
      return true;
    case RECURRENCE_MODE.FINITE_RECURRING:
      return true;
    case RECURRENCE_MODE.NON_RECURRING:
      return true;
  }
}

function checkLogLevel(level: LOG_LEVEL): boolean {
  switch (level) {
    case LOG_LEVEL.VERBOSE:
      return true;
    case LOG_LEVEL.DEBUG:
      return true;
    case LOG_LEVEL.INFO:
      return true;
    case LOG_LEVEL.WARN:
      return true;
    case LOG_LEVEL.ERROR:
      return true;
  }
}

function checkInAppMessageType(type: IN_APP_MESSAGE_TYPE): boolean {
  switch (type) {
    case IN_APP_MESSAGE_TYPE.BILLING_ISSUE:
      return true;
    case IN_APP_MESSAGE_TYPE.PRICE_INCREASE_CONSENT:
      return true;
    case IN_APP_MESSAGE_TYPE.GENERIC:
      return true;
    case IN_APP_MESSAGE_TYPE.WIN_BACK_OFFER:
      return true;
  }
}

function checkEntitlementVerificationMode(mode: ENTITLEMENT_VERIFICATION_MODE): boolean {
  switch (mode) {
    case ENTITLEMENT_VERIFICATION_MODE.DISABLED:
      return true;
    case ENTITLEMENT_VERIFICATION_MODE.INFORMATIONAL:
      return true;
  }
}

function checkPurchasesAreCompletedByType(type: PURCHASES_ARE_COMPLETED_BY_TYPE): boolean {
  switch (type) {
    case PURCHASES_ARE_COMPLETED_BY_TYPE.REVENUECAT:
      return true;
    case PURCHASES_ARE_COMPLETED_BY_TYPE.MY_APP:
      return true;
  }
}

function checkStoreKitVersion(version: STOREKIT_VERSION): boolean {
  switch (version) {
    case STOREKIT_VERSION.DEFAULT:
      return true;
    case STOREKIT_VERSION.STOREKIT_1:
      return true;
    case STOREKIT_VERSION.STOREKIT_2:
      return true;
  }
}

function checkVerificationResult(result: VERIFICATION_RESULT): boolean {
  switch (result) {
    case VERIFICATION_RESULT.NOT_REQUESTED:
      return true;
    case VERIFICATION_RESULT.VERIFIED:
      return true;
    case VERIFICATION_RESULT.FAILED:
      return true;
    case VERIFICATION_RESULT.VERIFIED_ON_DEVICE:
      return true;
  }
}

function checkProductType(type: PRODUCT_TYPE): boolean {
  switch (type) {
    case PRODUCT_TYPE.CONSUMABLE:
      return true;
    case PRODUCT_TYPE.NON_CONSUMABLE:
      return true;
    case PRODUCT_TYPE.NON_RENEWABLE_SUBSCRIPTION:
      return true;
    case PRODUCT_TYPE.AUTO_RENEWABLE_SUBSCRIPTION:
      return true;
    case PRODUCT_TYPE.PREPAID_SUBSCRIPTION:
      return true;
    case PRODUCT_TYPE.UNKNOWN:
      return true;
  }
}

function checkPurchaseType(type: PURCHASE_TYPE): boolean {
  switch (type) {
    case PURCHASE_TYPE.INAPP:
      return true;
    case PURCHASE_TYPE.SUBS:
      return true;
  }
}

function checkPaywallResult(result: PAYWALL_RESULT): boolean {
  switch (result) {
    case PAYWALL_RESULT.NOT_PRESENTED:
      return true;
    case PAYWALL_RESULT.CANCELLED:
      return true;
    case PAYWALL_RESULT.PURCHASED:
      return true;
    case PAYWALL_RESULT.RESTORED:
      return true;
    case PAYWALL_RESULT.ERROR:
      return true;
  }
}

function checkWebPurchaseRedemptionResultType(type: WebPurchaseRedemptionResultType): boolean {
  switch (type) {
    case WebPurchaseRedemptionResultType.SUCCESS:
      return true;
    case WebPurchaseRedemptionResultType.ERROR:
      return true;
    case WebPurchaseRedemptionResultType.PURCHASE_BELONGS_TO_OTHER_USER:
      return true;
    case WebPurchaseRedemptionResultType.INVALID_TOKEN:
      return true;
    case WebPurchaseRedemptionResultType.EXPIRED:
      return true;
  }
}

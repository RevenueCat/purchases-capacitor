import type {
  INTRO_ELIGIBILITY_STATUS,
  IntroEligibility,
  OFFER_PAYMENT_MODE,
  PACKAGE_TYPE,
  PERIOD_UNIT,
  PRODUCT_CATEGORY,
  PRORATION_MODE,
  PresentedOfferingContext,
  PresentedOfferingTargetingContext,
  Price,
  PricingPhase,
  Period,
  PurchasesIntroPrice,
  PurchasesOffering,
  PurchasesOfferings,
  PurchasesPackage,
  PurchasesPromotionalOffer,
  PurchasesStoreProduct,
  PurchasesStoreProductDiscount,
  RECURRENCE_MODE,
  SubscriptionOption,
  UpgradeInfo,
  InstallmentsInfo,
  GoogleProductChangeInfo,
  PurchasesWinBackOffer,
  PurchasesVirtualCurrency,
  PurchasesVirtualCurrencies,
  Storefront,
  PRODUCT_TYPE,
} from '@revenuecat/purchases-capacitor';

function checkProduct(product: PurchasesStoreProduct) {
  const identifier: string = product.identifier;
  const description: string = product.description;
  const title: string = product.title;
  const price: number = product.price;
  const priceString: string = product.priceString;
  const pricePerWeek: number | null = product.pricePerWeek;
  const pricePerMonth: number | null = product.pricePerMonth;
  const pricePerYear: number | null = product.pricePerYear;
  const pricePerWeekString: string | null = product.pricePerWeekString;
  const pricePerMonthString: string | null = product.pricePerMonthString;
  const pricePerYearString: string | null = product.pricePerYearString;
  const currencyCode: string = product.currencyCode;
  const introPrice: PurchasesIntroPrice | null = product.introPrice;
  const discounts: PurchasesStoreProductDiscount[] | null = product.discounts;
  const subscriptionPeriod: string | null = product.subscriptionPeriod;
  const productCategory: PRODUCT_CATEGORY | null = product.productCategory;
  const defaultOption: SubscriptionOption | null = product.defaultOption;
  const subscriptionOptions: SubscriptionOption[] | null = product.subscriptionOptions;
  const presentedOfferingIdentifier: string | null = product.presentedOfferingIdentifier;
  const presentedOfferingContext: PresentedOfferingContext | null = product.presentedOfferingContext;
  const productType: PRODUCT_TYPE = product.productType;
}

function checkDiscount(discount: PurchasesStoreProductDiscount) {
  const identifier: string = discount.identifier;
  const price: number = discount.price;
  const priceString: string = discount.priceString;
  const cycles: number = discount.cycles;
  const period: string = discount.period;
  const periodUnit: string = discount.periodUnit;
  const periodNumberOfUnits: number = discount.periodNumberOfUnits;
}

function checkIntroPrice(introPrice: PurchasesIntroPrice) {
  const price: number = introPrice.price;
  const priceString: string = introPrice.priceString;
  const cycles: number = introPrice.cycles;
  const period: string = introPrice.period;
  const periodUnit: string = introPrice.periodUnit;
  const periodNumberOfUnits: number = introPrice.periodNumberOfUnits;
}

function checkPackage(pack: PurchasesPackage) {
  const identifier: string = pack.identifier;
  const packageType: PACKAGE_TYPE = pack.packageType;
  const product: PurchasesStoreProduct = pack.product;
  const offeringIdentifier: string = pack.offeringIdentifier;
  const presentedOfferingContext: PresentedOfferingContext = pack.presentedOfferingContext;
  const webCheckoutUrl: string | null = pack.webCheckoutUrl;
}

function checkOffering(offering: PurchasesOffering) {
  const identifier: string = offering.identifier;
  const serverDescription: string = offering.serverDescription;
  const metadata: { [key: string]: unknown } = offering.metadata;
  const availablePackages: PurchasesPackage[] = offering.availablePackages;
  const lifetime: PurchasesPackage | null = offering.lifetime;
  const annual: PurchasesPackage | null = offering.annual;
  const sixMonth: PurchasesPackage | null = offering.sixMonth;
  const threeMonth: PurchasesPackage | null = offering.threeMonth;
  const twoMonth: PurchasesPackage | null = offering.twoMonth;
  const monthly: PurchasesPackage | null = offering.monthly;
  const weekly: PurchasesPackage | null = offering.weekly;
  const webCheckoutUrl: string | null = offering.webCheckoutUrl;
}

function checkOfferings(offerings: PurchasesOfferings) {
  const all: { [p: string]: PurchasesOffering } = offerings.all;
  const current: PurchasesOffering | null = offerings.current;
}

function checkIntroEligibility(eligibility: IntroEligibility) {
  const status: INTRO_ELIGIBILITY_STATUS = eligibility.status;
  const description: string = eligibility.description;
}

function checkPromotionalOffer(discount: PurchasesPromotionalOffer) {
  const identifier: string = discount.identifier;
  const keyIdentifier: string = discount.keyIdentifier;
  const nonce: string = discount.nonce;
  const signature: string = discount.signature;
  const timestamp: number = discount.timestamp;
}

function checkSubscriptionOption(option: SubscriptionOption) {
  const id: string = option.id;
  const storeProductId: string = option.storeProductId;
  const productId: string = option.productId;
  const pricingPhases: PricingPhase[] = option.pricingPhases;
  const tags: string[] = option.tags;
  const isBasePlan: boolean = option.isBasePlan;
  const billingPeriod: Period | null = option.billingPeriod;
  const isPrepaid: boolean = option.isPrepaid;
  const fullPricePhase: PricingPhase | null = option.fullPricePhase;
  const freePhase: PricingPhase | null = option.freePhase;
  const introPhase: PricingPhase | null = option.introPhase;
  const presentedOfferingIdentifier: string | null = option.presentedOfferingIdentifier;
  const presentedOfferingContext: PresentedOfferingContext | null = option.presentedOfferingContext;
  const installmentsInfo: InstallmentsInfo | null = option.installmentsInfo;
}

function checkInstallmentsInfo(installmentsInfo: InstallmentsInfo) {
  const commitmentPaymentsCount: number = installmentsInfo.commitmentPaymentsCount;
  const renewalCommitmentPaymentsCount: number = installmentsInfo.renewalCommitmentPaymentsCount;
}

function checkPricingPhase(pricePhase: PricingPhase) {
  const billingPeriod: Period = pricePhase.billingPeriod;
  const recurrenceMode: RECURRENCE_MODE | null = pricePhase.recurrenceMode;
  const billingCycleCount: number | null = pricePhase.billingCycleCount;
  const price: Price = pricePhase.price;
  const offerPaymentMode: OFFER_PAYMENT_MODE | null = pricePhase.offerPaymentMode;
}

function checkPeriod(period: Period) {
  const unit: PERIOD_UNIT = period.unit;
  const value: number = period.value;
  const iso8601: string = period.iso8601;
}

function checkPrice(price: Price) {
  const formatted: string = price.formatted;
  const amountMicros: number = price.amountMicros;
  const currencyCode: string = price.currencyCode;
}

function checkPresentedOfferingContext(presentedOfferingContext: PresentedOfferingContext) {
  const offeringIdentifier: string = presentedOfferingContext.offeringIdentifier;
  const placementIdentifier: string | null = presentedOfferingContext.placementIdentifier;
  const targetingContext: PresentedOfferingTargetingContext | null = presentedOfferingContext.targetingContext;
}

function checkPresentedOfferingTargetingContext(targetingContext: PresentedOfferingTargetingContext) {
  const revision: number = targetingContext.revision;
  const ruleId: string = targetingContext.ruleId;
}

function checkUpgradeInfo(upgradeInfo: UpgradeInfo) {
  const oldSKU: string = upgradeInfo.oldSKU;
  const prorationMode: PRORATION_MODE | undefined = upgradeInfo.prorationMode;
}

function checkGoogleProductChangeInfo(info: GoogleProductChangeInfo) {
  const oldProductIdentifier: string = info.oldProductIdentifier;
  const prorationMode: PRORATION_MODE | undefined = info.prorationMode;
}

function checkWinBackOffer(offer: PurchasesWinBackOffer) {
  const identifier: string = offer.identifier;
  const price: number = offer.price;
  const priceString: string = offer.priceString;
  const cycles: number = offer.cycles;
  const period: string = offer.period;
  const periodUnit: string = offer.periodUnit;
  const periodNumberOfUnits: number = offer.periodNumberOfUnits;
}

function checkStorefront(storefront: Storefront) {
  const countryCode: string = storefront.countryCode;
}

function checkVirtualCurrencies(currencies: PurchasesVirtualCurrencies) {
  const all: { [key: string]: PurchasesVirtualCurrency } = currencies.all;
}

function checkVirtualCurrency(currency: PurchasesVirtualCurrency) {
  const balance: number = currency.balance;
  const name: string = currency.name;
  const code: string = currency.code;
  const serverDescription: string | null = currency.serverDescription;
}

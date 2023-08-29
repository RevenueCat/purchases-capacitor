import './FunctionTesterContainer.css';
import {IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle} from "@ionic/react";
import React, {useEffect, useState} from "react";
import {
  LOG_LEVEL,
  PRODUCT_CATEGORY,
  PurchaseDiscountedPackageOptions,
  Purchases
} from "@revenuecat/purchases-capacitor";
import {REVENUECAT_API_KEY} from "../constants";

interface ContainerProps { }

const FunctionTesterContainer: React.FC<ContainerProps> = () => {
  useEffect(() => {
    (async function () {
      await Purchases.setLogLevel({ level: LOG_LEVEL.VERBOSE });
    })();
  }, []);

  const [lastFunctionExecuted, setLastFunctionExecuted] = useState("No RC function with result executed");
  const [lastFunctionContent, setLastFunctionContent] = useState("No content");
  const [finishTransactions, setFinishTransactions] = useState(true);
  const [simulatesAskToBuyInSandbox, setSimulatesAskToBuyInSandbox] = useState(false);

  const prettifyJson = (objectToPrettify: object) => {
    return JSON.stringify(objectToPrettify, null, 2);
  }

  const updateLastFunction = (lastFunctionExecuted: string, lastFunctionContent: object | string) => {
    setLastFunctionExecuted(lastFunctionExecuted);
    if (typeof lastFunctionContent == 'string') {
      setLastFunctionContent(lastFunctionContent);
    } else {
      setLastFunctionContent(prettifyJson(lastFunctionContent));
    }
  }

  const updateLastFunctionWithoutContent = (lastFunctionExecuted: string) => {
    setLastFunctionExecuted(lastFunctionExecuted);
    setLastFunctionContent(`${lastFunctionExecuted} does not return content`);
  }

  const getPackageAndOfferForCurrentOfferingFirstPackage = async () => {
    const offerings = await Purchases.getOfferings();
    const packageToBuy = offerings.current
      && offerings.current.availablePackages
      && offerings.current.availablePackages[0];
    if (packageToBuy == null) {
      return Promise.reject("No package found in current offering");
    }
    const productToBuy = packageToBuy.product;
    const discountToApply = productToBuy.discounts && productToBuy.discounts[0]
    if (discountToApply == null) {
      return Promise.reject("Package did not have any discounts to apply");
    }
    const promotionalOffer = await Purchases.getPromotionalOffer(
      { product: productToBuy, discount: discountToApply }
    )
    if (promotionalOffer == null) {
      return Promise.reject("Could not obtain promotional offer");
    }
    const options: PurchaseDiscountedPackageOptions = { aPackage: packageToBuy, discount: promotionalOffer };
    return options;
  }

  const configure = async () => {
    await Purchases.configure({
      apiKey: REVENUECAT_API_KEY
    });
    await Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      console.log(`Received customer info in listener: ${prettifyJson(customerInfo)}`);
    });
    updateLastFunctionWithoutContent("configure");
  };

  const changeFinishTransactions = async () => {
    const newFinishTransactions = !finishTransactions;
    await Purchases.setFinishTransactions({ finishTransactions: newFinishTransactions });
    setFinishTransactions(newFinishTransactions);
    updateLastFunctionWithoutContent("setFinishTransactions");
  };

  const changeSimulatesAskToBuyInSandbox = async () => {
    const newSimulatesAskToBuyInSandbox = !simulatesAskToBuyInSandbox;
    await Purchases.setSimulatesAskToBuyInSandbox({ simulatesAskToBuyInSandbox: newSimulatesAskToBuyInSandbox });
    setSimulatesAskToBuyInSandbox(newSimulatesAskToBuyInSandbox);
    updateLastFunctionWithoutContent("setSimulatesAskToBuyInSandbox");
  };

  const getOfferings = async () => {
    const offerings = await Purchases.getOfferings();
    updateLastFunction("getOfferings", offerings);
  };

  const getProducts = async () => {
    const productIds = ["annual_freetrial", "unknown_product"];
    const products = await Purchases.getProducts({
      productIdentifiers: productIds,
      type: PRODUCT_CATEGORY.SUBSCRIPTION,
    });
    updateLastFunction("getProducts", products);
  };

  const purchaseStoreProduct = async () => {
    const offerings = await Purchases.getOfferings();
    const productToBuy = offerings.current
      && offerings.current.availablePackages
      && offerings.current.availablePackages[0].product;
    if (productToBuy == null) {
      updateLastFunction(
        "purchaseStoreProduct",
        "No product found in current offering",
      );
      return
    }
    const purchaseResult = await Purchases.purchaseStoreProduct({
      product: productToBuy
    });
    updateLastFunction("purchaseStoreProduct", purchaseResult);
  }

  const purchaseDiscountedProduct = async () => {
    const offerings = await Purchases.getOfferings();
    const productToBuy = offerings.current
      && offerings.current.availablePackages
      && offerings.current.availablePackages[0].product;
    if (productToBuy == null) {
      updateLastFunction(
        "purchaseDiscountedProduct",
        "No product found in current offering",
      );
      return;
    }
    const discountToApply = productToBuy.discounts && productToBuy.discounts[0];
    if (discountToApply == null) {
      updateLastFunction(
        "purchaseDiscountedProduct",
        "Product did not have any discounts to apply",
      );
      return;
    }
    const promotionalOffer = await Purchases.getPromotionalOffer(
      { product: productToBuy, discount: discountToApply }
    )
    if (promotionalOffer == null) {
      updateLastFunction(
        "purchaseDiscountedProduct",
        "Could not obtain promotional offer",
      );
      return;
    }
    const purchaseResult = await Purchases.purchaseDiscountedProduct({
      product: productToBuy,
      discount: promotionalOffer,
    });
    updateLastFunction("purchaseDiscountedProduct", purchaseResult);
  }

  const purchasePackage = async () => {
    const offerings = await Purchases.getOfferings();
    const packageToBuy = offerings.current
      && offerings.current.availablePackages
      && offerings.current.availablePackages[0];
    if (packageToBuy == null) {
      updateLastFunction(
        "purchasePackage",
        "No package found in current offering",
      );
      return;
    }
    const purchaseResult = await Purchases.purchasePackage({
      aPackage: packageToBuy,
    });
    updateLastFunction("purchasePackage", purchaseResult);
  }

  const purchaseDiscountedPackage = async () => {
    try {
      const purchaseDiscountedPackageOptions = await getPackageAndOfferForCurrentOfferingFirstPackage();
      const purchaseResult = await Purchases.purchaseDiscountedPackage(purchaseDiscountedPackageOptions);
      updateLastFunction("purchaseDiscountedPackage", purchaseResult);
    } catch (e: any) {
      updateLastFunction("purchaseDiscountedPackage", e)
    }
  }

  const restorePurchases = async () => {
    const customerInfo = await Purchases.restorePurchases();
    updateLastFunction("restorePurchases", customerInfo);
  };

  const getAppUserID = async () => {
    const appUserID = await Purchases.getAppUserID();
    updateLastFunction("getAppUserID", appUserID);
  };

  const logIn = async () => {
    const appUserIDToUse = "test-capacitor-app-user-id";
    const customerInfo = await Purchases.logIn({ appUserID: appUserIDToUse});
    updateLastFunction("logIn", customerInfo);
  };

  const logOut = async () => {
    const customerInfo = await Purchases.logOut();
    updateLastFunction("logOut", customerInfo);
  };

  const getCustomerInfo = async () => {
    const customerInfo = await Purchases.getCustomerInfo();
    updateLastFunction("getCustomerInfo", customerInfo);
  };

  const syncPurchases = async () => {
    await Purchases.syncPurchases();
    updateLastFunctionWithoutContent("syncPurchases");
  };

  const syncObserverModeAmazonPurchase = async () => {
    const productIDToSync = "test-amazon-product-id";
    const receiptIDToSync = "test-amazon-receipt-id";
    const amazonUserIDToSync = "test-amazon-user-id";
    await Purchases.syncObserverModeAmazonPurchase({
      productID: productIDToSync,
      receiptID: receiptIDToSync,
      amazonUserID: amazonUserIDToSync,
    });
    updateLastFunctionWithoutContent("syncObserverModeAmazonPurchase");
  };

  const enableAdServicesAttributionTokenCollection = async () => {
    await Purchases.enableAdServicesAttributionTokenCollection();
    updateLastFunctionWithoutContent("enableAdServicesAttributionTokenCollection");
  };

  const isAnonymous = async () => {
    const isAnonymousResult = await Purchases.isAnonymous();
    updateLastFunction("isAnonymous", isAnonymousResult);
  };

  const checkTrialOrIntroductoryPriceEligibility = async () => {
    const productIDsToCheck = ["annual_freetrial"];
    const checkElibilityResult = await Purchases.checkTrialOrIntroductoryPriceEligibility(
      { productIdentifiers: productIDsToCheck}
    );
    updateLastFunction("checkTrialOrIntroductoryPriceEligibility", checkElibilityResult);
  };

  const getPromotionalOffer = async () => {
    try {
      const purchaseDiscountedPackageOptions = await getPackageAndOfferForCurrentOfferingFirstPackage();
      updateLastFunction("getPromotionalOffer", purchaseDiscountedPackageOptions.discount);
    } catch (e: any) {
      updateLastFunction("purchaseDiscountedPackage", e)
    }
  };

  const invalidateCustomerInfo = async () => {
    await Purchases.invalidateCustomerInfoCache();
    updateLastFunctionWithoutContent("invalidateCustomerInfo");
  };

  const presentCodeRedemptionSheet = async () => {
    await Purchases.presentCodeRedemptionSheet();
    updateLastFunctionWithoutContent("presentCodeRedemptionSheet");
  };

  const setAttributes = async () => {
    const attributesToSet = {
      "my-test-attribute-1": "test-attribute-value-1",
      "my-test-attribute-2": "test-attribute-value-2",
    }
    await Purchases.setAttributes(attributesToSet);
    updateLastFunctionWithoutContent("setAttributes");
  };

  const setEmail = async () => {
    await Purchases.setEmail({ email: "testemail@revenuecat.com" });
    updateLastFunctionWithoutContent("setEmail");
  };

  const setPhoneNumber = async () => {
    await Purchases.setPhoneNumber({ phoneNumber: "111-111-1111" });
    updateLastFunctionWithoutContent("setPhoneNumber");
  };

  const setDisplayName = async () => {
    await Purchases.setDisplayName({ displayName: "test-display-name" });
    updateLastFunctionWithoutContent("setDisplayName");
  };

  const setPushToken = async () => {
    await Purchases.setPushToken({ pushToken: "test-push-token" });
    updateLastFunctionWithoutContent("setPushToken");
  };

  const setProxyURL = async () => {
    await Purchases.setProxyURL({ url: "http://localhost:8080:5050/" });
    updateLastFunctionWithoutContent("setProxyURL");
  };

  const collectDeviceIdentifiers = async () => {
    await Purchases.collectDeviceIdentifiers();
    updateLastFunctionWithoutContent("collectDeviceIdentifiers");
  };

  const setAdjustID = async () => {
    await Purchases.setAdjustID({ adjustID: "test-adjust-id" });
    updateLastFunctionWithoutContent("setAdjustID");
  };

  const setAppsflyerID = async () => {
    await Purchases.setAppsflyerID({ appsflyerID: "test-appsflyer-id" });
    updateLastFunctionWithoutContent("setAppsflyerID");
  };

  const setFBAnonymousID = async () => {
    await Purchases.setFBAnonymousID({ fbAnonymousID: "test-fb-anonymous-id" });
    updateLastFunctionWithoutContent("setFBAnonymousID");
  };

  const setMparticleID = async () => {
    await Purchases.setMparticleID({ mparticleID: "test-mparticle-id" });
    updateLastFunctionWithoutContent("setMparticleID");
  };

  const setCleverTapID = async () => {
    await Purchases.setCleverTapID({ cleverTapID: "test-clever-tap-id" });
    updateLastFunctionWithoutContent("setCleverTapID");
  };

  const setMixpanelDistinctID = async () => {
    await Purchases.setMixpanelDistinctID({ mixpanelDistinctID: "test-mixpanel-distinct-id" });
    updateLastFunctionWithoutContent("setMixpanelDistinctID");
  };

  const setFirebaseAppInstanceID = async () => {
    await Purchases.setFirebaseAppInstanceID({ firebaseAppInstanceID: "test-firebase-app-instance-id" });
    updateLastFunctionWithoutContent("setFirebaseAppInstanceID");
  };

  const setOnesignalID = async () => {
    await Purchases.setOnesignalID({ onesignalID: "test-onesignal-id" });
    updateLastFunctionWithoutContent("setOnesignalID");
  };

  const setAirshipChannelID = async () => {
    await Purchases.setAirshipChannelID({ airshipChannelID: "test-airship-channel-id" });
    updateLastFunctionWithoutContent("setAirshipChannelID");
  };

  const setMediaSource = async () => {
    await Purchases.setMediaSource({ mediaSource: "test-media-source" });
    updateLastFunctionWithoutContent("setMediaSource");
  };

  const setCampaign = async () => {
    await Purchases.setCampaign({ campaign: "test-campaign" });
    updateLastFunctionWithoutContent("setCampaign");
  };

  const setAdGroup = async () => {
    await Purchases.setAdGroup({ adGroup: "test-ad-group" });
    updateLastFunctionWithoutContent("setAdGroup");
  };

  const setAd = async () => {
    await Purchases.setAd({ ad: "test-ad" });
    updateLastFunctionWithoutContent("setAd");
  };

  const setKeyword = async () => {
    await Purchases.setKeyword({ keyword: "test-keyword" });
    updateLastFunctionWithoutContent("setKeyword");
  };

  const setCreative = async () => {
    await Purchases.setCreative({ creative: "test-creative" });
    updateLastFunctionWithoutContent("setCreative");
  };

  const canMakePayments = async () => {
    const canMakePaymentsResult = await Purchases.canMakePayments();
    updateLastFunction("canMakePayments", canMakePaymentsResult);
  };

  const beginRefundRequestForActiveEntitlement = async () => {
    const refundRequestStatus = await Purchases.beginRefundRequestForActiveEntitlement();
    updateLastFunction("beginRefundRequestForActiveEntitlement", refundRequestStatus);
  };

  const beginRefundRequestForEntitlement = async () => {
    const customerInfo = await Purchases.getCustomerInfo();
    const activeEntitlements = customerInfo.customerInfo.entitlements.active
    const activeEntitlementKeys = Object.keys(activeEntitlements)
    if (activeEntitlementKeys.length == 0) {
      updateLastFunction("beginRefundRequestForEntitlement", "No active entitlement to refund");
    } else {
      const refundRequestStatus = await Purchases.beginRefundRequestForEntitlement(
        { entitlementInfo: activeEntitlements[activeEntitlementKeys[0]] }
      );
      updateLastFunction("beginRefundRequestForEntitlement", refundRequestStatus);
    }
  };

  const beginRefundRequestForProduct = async () => {
    const customerInfo = await Purchases.getCustomerInfo();
    const activeEntitlements = customerInfo.customerInfo.entitlements.active
    const activeEntitlementKeys = Object.keys(activeEntitlements)
    if (activeEntitlementKeys.length == 0) {
      updateLastFunction("beginRefundRequestForProduct", "No active entitlement to refund");
    } else {
      const activePurchasedProductID = activeEntitlements[activeEntitlementKeys[0]].productIdentifier;
      const activePurchasedProduct = await Purchases.getProducts(
        { productIdentifiers: [activePurchasedProductID] }
      )
      if (activePurchasedProduct.products.length == 0) {
        updateLastFunction("beginRefundRequestForProduct", "No product found for active entitlement product id");
      }
      const refundRequestStatus = await Purchases.beginRefundRequestForProduct(
        { storeProduct:  activePurchasedProduct.products[0] }
      );
      updateLastFunction("beginRefundRequestForProduct", refundRequestStatus);
    }
  };

  const isConfigured = async () => {
    const isConfiguredResult = await Purchases.isConfigured();
    updateLastFunction("isConfigured", isConfiguredResult);
  };

  return (
    <div id="container">
      <IonCard id={"last_request_card"}>
        <IonCardHeader>
          <IonCardTitle>Last request result</IonCardTitle>
          <IonCardSubtitle id={"last_request_subtitle"}>{lastFunctionExecuted}</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent id={"last_request_content"}><pre>{lastFunctionContent}</pre></IonCardContent>
      </IonCard>

      <div id="button_actions">
        <IonButton size="small" onClick={ configure }>Configure</IonButton>
        <IonButton size="small" onClick={ changeFinishTransactions }>{ `Set finishTransactions to ${!finishTransactions}` }</IonButton>
        <IonButton size="small" onClick={ changeSimulatesAskToBuyInSandbox }>{ `Set simulatesAskToBuyInSandbox to ${!simulatesAskToBuyInSandbox}` }</IonButton>
        <IonButton size="small" onClick={ getOfferings }>Get offerings</IonButton>
        <IonButton size="small" onClick={ getProducts }>Get products</IonButton>
        <IonButton size="small" onClick={ purchaseStoreProduct }>Purchase current offerings first product</IonButton>
        <IonButton size="small" onClick={ purchaseDiscountedProduct }>Purchase product with discount</IonButton>
        <IonButton size="small" onClick={ purchasePackage }>Purchase current offerings first package</IonButton>
        <IonButton size="small" onClick={ purchaseDiscountedPackage }>Purchase package with discount</IonButton>
        <IonButton size="small" onClick={ restorePurchases }>Restore purchases</IonButton>
        <IonButton size="small" onClick={ getAppUserID }>Get current user id</IonButton>
        <IonButton size="small" onClick={ logIn }>Log in with test-app-user-id</IonButton>
        <IonButton size="small" onClick={ logOut }>Log out</IonButton>
        <IonButton size="small" onClick={ getCustomerInfo }>Get customer info</IonButton>
        <IonButton size="small" onClick={ syncPurchases }>Sync purchases</IonButton>
        <IonButton size="small" onClick={ syncObserverModeAmazonPurchase }>Sync observer mode amazon purchase</IonButton>
        <IonButton size="small" onClick={ isAnonymous }>Is anonymous?</IonButton>
        <IonButton size="small" onClick={ enableAdServicesAttributionTokenCollection }>Enable ad attribution collection</IonButton>
        <IonButton size="small" onClick={ checkTrialOrIntroductoryPriceEligibility }>Check trial or intro eligibility</IonButton>
        <IonButton size="small" onClick={ getPromotionalOffer }>Get promotional offer</IonButton>
        <IonButton size="small" onClick={ invalidateCustomerInfo }>Invalidate customer info</IonButton>
        <IonButton size="small" onClick={ presentCodeRedemptionSheet }>Present code redemption sheet</IonButton>
        <IonButton size="small" onClick={ setAttributes }>Set attributes</IonButton>
        <IonButton size="small" onClick={ setEmail }>Set email</IonButton>
        <IonButton size="small" onClick={ setPhoneNumber }>Set phoneNumber</IonButton>
        <IonButton size="small" onClick={ setDisplayName }>Set displayName</IonButton>
        <IonButton size="small" onClick={ setPushToken }>Set pushToken</IonButton>
        <IonButton size="small" onClick={ setProxyURL }>Set proxyURL</IonButton>
        <IonButton size="small" onClick={ collectDeviceIdentifiers }>Collect device identifiers</IonButton>
        <IonButton size="small" onClick={ setAdjustID }>Set adjustID</IonButton>
        <IonButton size="small" onClick={ setAppsflyerID }>Set appsflyerID</IonButton>
        <IonButton size="small" onClick={ setFBAnonymousID }>Set fbAnonymousID</IonButton>
        <IonButton size="small" onClick={ setMparticleID }>Set mParticleID</IonButton>
        <IonButton size="small" onClick={ setCleverTapID }>Set cleverTapID</IonButton>
        <IonButton size="small" onClick={ setMixpanelDistinctID }>Set mixpanelDistinctID</IonButton>
        <IonButton size="small" onClick={ setFirebaseAppInstanceID }>Set firebaseAppInstanceID</IonButton>
        <IonButton size="small" onClick={ setOnesignalID }>Set onesignalID</IonButton>
        <IonButton size="small" onClick={ setAirshipChannelID }>Set airshipChannelID</IonButton>
        <IonButton size="small" onClick={ setMediaSource }>Set mediaSource</IonButton>
        <IonButton size="small" onClick={ setCampaign }>Set campaign</IonButton>
        <IonButton size="small" onClick={ setAdGroup }>Set adGroup</IonButton>
        <IonButton size="small" onClick={ setAd }>Set ad</IonButton>
        <IonButton size="small" onClick={ setKeyword }>Set keyword</IonButton>
        <IonButton size="small" onClick={ setCreative }>Set creative</IonButton>
        <IonButton size="small" onClick={ canMakePayments }>Can make payments</IonButton>
        <IonButton size="small" onClick={ beginRefundRequestForActiveEntitlement }>Begin refund for active entitlement</IonButton>
        <IonButton size="small" onClick={ beginRefundRequestForEntitlement }>Begin refund for entitlement</IonButton>
        <IonButton size="small" onClick={ beginRefundRequestForProduct }>Begin refund for product</IonButton>
        <IonButton size="small" onClick={ isConfigured }>Is configured?</IonButton>
      </div>
    </div>
  );
};

export default FunctionTesterContainer;

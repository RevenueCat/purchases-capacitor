import './FunctionTesterContainer.css';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/react';
import React, { useState } from 'react';
import {
  Purchases,
  PurchasesPackage,
  PurchasesStoreProduct,
  PurchasesWinBackOffer,
} from '@revenuecat/purchases-capacitor';

interface ContainerProps {}

const buttonStyle = {
  whiteSpace: 'normal',
  height: 'auto',
};

const WinBackOfferTestingContainer: React.FC<ContainerProps> = () => {
  const [product, setProduct] = useState<any>(null);
  const [productWinBackOffers, setProductWinBackOffers] = useState<any[]>([]);
  const [package_, setPackage] = useState<any>(null);
  const [packageWinBackOffers, setPackageWinBackOffers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    try {
      const products = await Purchases.getProducts({
        productIdentifiers: ['com.revenuecat.monthly_4.99.1_week_intro'],
      });
      if (products.products.length > 0) {
        setProduct(products.products[0]);
      } else {
        setError('No products available');
      }
    } catch (err) {
      setError(`Failed to fetch products: ${err}`);
    }
  };

  const purchaseProduct = async (product: any) => {
    try {
      const purchaseResult = await Purchases.purchaseStoreProduct({
        product,
      });
      console.log('Purchase successful:', purchaseResult);
    } catch (err) {
      console.log('Purchase failed:', err);
    }
  };

  const fetchEligibleWinBackOffersForProduct = async (
    product: PurchasesStoreProduct,
  ) => {
    try {
      const offers = await Purchases.getEligibleWinBackOffersForProduct({
        product,
      });
      setProductWinBackOffers(offers?.eligibleWinBackOffers || []);
    } catch (err) {
      console.log('Error fetching win-back offers:', err);
      setProductWinBackOffers([]);
    }
  };

  const fetchEligibleWinBackOffersForPackage = async (aPackage: any) => {
    try {
      const offers = await Purchases.getEligibleWinBackOffersForPackage({
        aPackage,
      });
      console.log('offers', offers);
      setPackageWinBackOffers(offers?.eligibleWinBackOffers || []);
    } catch (err) {
      console.log('Error fetching win-back offers:', err);
      setPackageWinBackOffers([]);
    }
  };

  const purchaseWinBackOfferForProduct = async (product: any, offer: any) => {
    try {
      const result = await Purchases.purchaseProductWithWinBackOffer({
        product,
        winBackOffer: offer,
      });
      console.log('Win-Back Offer purchase successful:', result);
    } catch (err) {
      console.log('Win-Back Offer purchase failed:', err);
    }
  };

  const fetchPackage = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      const monthlyPackage = offerings.current?.availablePackages.find(
        pkg => pkg.identifier === '$rc_monthly',
      );

      if (monthlyPackage) {
        setPackage(monthlyPackage);
      }
    } catch (err) {
      console.log('Error fetching package:', err);
    }
  };

  const purchasePackage = async (package_: any) => {
    try {
      const purchaseResult = await Purchases.purchasePackage({
        aPackage: package_,
      });
      console.log('Purchase successful:', purchaseResult);
    } catch (err) {
      console.log('Purchase failed:', err);
    }
  };

  const purchaseWinBackOfferForPackage = async (
    package_: PurchasesPackage,
    offer: PurchasesWinBackOffer,
  ) => {
    try {
      const result = await Purchases.purchasePackageWithWinBackOffer({
        aPackage: package_,
        winBackOffer: offer,
      });
      console.log('Win-Back Offer purchase successful:', result);
    } catch (err) {
      console.log('Win-Back Offer purchase failed:', err);
    }
  };

  return (
    <div className="container">
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Win-Back Testing</IonCardTitle>
          <IonCardSubtitle>
            Use this screen to fetch eligible win-back offers, purchase products
            without a win-back offer, and purchase products with an eligible
            win-back offer.
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <p>
            This test relies on products and offers defined in the SKConfig
            file, so be sure to launch the PurchaseTester app from Xcode with
            the SKConfig file configured.
          </p>

          <IonButton expand="block" onClick={fetchProduct} style={buttonStyle}>
            Fetch Product
          </IonButton>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          {product && (
            <IonCard>
              <IonCardContent>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <p>{product.priceString}</p>

                <IonButton
                  expand="block"
                  onClick={() => purchaseProduct(product)}
                >
                  Purchase
                </IonButton>

                <IonButton
                  expand="block"
                  onClick={() => fetchEligibleWinBackOffersForProduct(product)}
                  style={buttonStyle}
                >
                  Fetch Eligible Win-Back Offers for this Product
                </IonButton>

                {productWinBackOffers.map((offer, index) => (
                  <IonCard key={index}>
                    <IonCardContent>
                      <p>Identifier: {offer.identifier}</p>
                      <p>Price: {offer.priceString}</p>
                      <p>Cycles: {offer.cycles}</p>
                      <p>Period: {offer.period}</p>
                      <p>Period Unit: {offer.periodUnit}</p>
                      <p>Period Number of Units: {offer.periodNumberOfUnits}</p>

                      <IonButton
                        expand="block"
                        onClick={() =>
                          purchaseWinBackOfferForProduct(product, offer)
                        }
                      >
                        Purchase Win-Back Offer
                      </IonButton>
                    </IonCardContent>
                  </IonCard>
                ))}
              </IonCardContent>
            </IonCard>
          )}

          <IonButton expand="block" onClick={fetchPackage}>
            Fetch Package
          </IonButton>

          {package_ && (
            <IonCard>
              <IonCardContent>
                <p>{package_.identifier}</p>
                <p>{package_.product.description}</p>
                <p>{package_.product.priceString}</p>

                <IonButton
                  expand="block"
                  onClick={() => purchasePackage(package_)}
                >
                  Purchase
                </IonButton>

                <IonButton
                  expand="block"
                  onClick={() => fetchEligibleWinBackOffersForPackage(package_)}
                  style={buttonStyle}
                >
                  Fetch Eligible Win-Back Offers for this Package
                </IonButton>

                {packageWinBackOffers.map((offer, index) => (
                  <IonCard key={index}>
                    <IonCardContent>
                      <p>Identifier: {offer.identifier}</p>
                      <p>Price: {offer.priceString}</p>
                      <p>Cycles: {offer.cycles}</p>
                      <p>Period: {offer.period}</p>
                      <p>Period Unit: {offer.periodUnit}</p>
                      <p>Period Number of Units: {offer.periodNumberOfUnits}</p>

                      <IonButton
                        expand="block"
                        onClick={() =>
                          purchaseWinBackOfferForPackage(package_, offer)
                        }
                      >
                        Purchase Win-Back Offer
                      </IonButton>
                    </IonCardContent>
                  </IonCard>
                ))}
              </IonCardContent>
            </IonCard>
          )}
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default WinBackOfferTestingContainer;

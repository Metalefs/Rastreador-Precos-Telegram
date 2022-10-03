require("dotenv").config();

import { scoutGoogleShopping } from "./navigator";
import { Db } from "mongodb";
import { Offer } from "../shared/interfaces/offer";

export class PriceFinder {
  constructor(private dbconnection: Db) {}

  getPrices = async (query, config?) => {
    const googleOffers = await scoutGoogleShopping(query, config);

    let bestOffer:any = {normalPrice:Number.MAX_VALUE, promoPrice:Number.MAX_VALUE};

    for(const offer of googleOffers.offers) {
      const element = offer;
      if(element.merchant.offers){
        const product_offers = element.merchant.offers;
        product_offers.forEach(_offer => {
          //if(_offer?.features?.toLocaleLowerCase().includes(query.toLocaleLowerCase())){
            bestOffer = this.filterBestPrice(_offer,bestOffer);
          //}
        })
      }
    }

    return bestOffer as Offer;
  };

  private filterBestPrice(offer, bestOffer){
    if(offer.link && (offer.normalPrice != '' || offer.normalPrice != '') && offer.store){
              
      const offerPrice = parseFloat((offer.normalPrice).replace('R$','').replace(',','.'));
      const offerPromo = parseFloat((offer.promoPrice).replace('R$','').replace(',','.'));
      
      if((offerPrice < bestOffer.normalPrice) || offerPromo < bestOffer.promoPrice){
        return offer;
      }
    }
    return bestOffer;
  }

  getPricesArray = async (query, force = false) => {
    const offers: any = [];

    query.forEach(async (q) => {
      offers.push(await this.getPrices(q));
    });
    return offers;
  };
  
  getGroceryPricesArray = async (query) => {
    const offers: any = [];

    query.forEach(async (q) => {
      offers.push(await this.getPrices(q, { useMerchants: false }));
    });
    return offers;
  };
}

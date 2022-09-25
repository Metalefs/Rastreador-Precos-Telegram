require("dotenv").config();

import { scoutGoogleShopping } from "./navigator";
import moment from "moment";
import { Db } from "mongodb";
import { Offer } from "./interfaces/offer";

export class PriceFinder {
  constructor(private dbconnection: Db) {}

  getPrices = async (query, force = false) => {
    const googleOffers = await scoutGoogleShopping(query);

    let bestOffer:any = {normalPrice:Number.MAX_VALUE, promoPrice:Number.MAX_VALUE};
    for (let i = 0; i < googleOffers.offers.length; i++) {
      const element = googleOffers.offers[i];
      if(element.merchant.offers){
        let product_offers = element.merchant.offers;
        product_offers.forEach(offer => {
          if(offer?.features?.toLocaleLowerCase().includes(query.toLocaleLowerCase())){
            if(offer.link && (offer.normalPrice != '' || offer.normalPrice != '') && offer.store){
              
              const offerPrice = parseFloat((offer.normalPrice!).replace('R$','').replace(',','.'));
              const offerPromo = parseFloat((offer.promoPrice!).replace('R$','').replace(',','.'));
              
              if((offerPrice! < bestOffer.normalPrice) || offerPromo < bestOffer.promoPrice){
                bestOffer = offer;
              }
            }
          }
        })
      }
    }

    return bestOffer as Offer;
  };

  getPricesArray = async (query, force = false) => {
    let offers: any = [];

    query.forEach(async (q) => {
      offers.push(await this.getPrices(q));
    });
    return offers;
  };
}

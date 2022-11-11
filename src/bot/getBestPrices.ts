require("dotenv").config();

import { scoutGoogleShopping, ThisOffer } from "./navigator";
import { Db } from "mongodb";
import { Offer } from "src/shared/interfaces/offer";

export class PriceFinder {
  constructor(private dbconnection: Db) {}

  async getPrices(query, config?) {
    const googleOffers = await scoutGoogleShopping(query, config, this.dbconnection) as {
      query: any;
      offers: ThisOffer[];
    };
    let bestOffer:any = {normalPrice:Number.MAX_VALUE, promoPrice:Number.MAX_VALUE};
    const bestOffers = [];
    for(const offer of googleOffers.offers) {
      const element = offer;
      if(element.merchant.offers){
        const product_offers = element.merchant.offers;
        product_offers.forEach((_offer, idx) => {
          //if(_offer?.features?.toLocaleLowerCase().includes(query.toLocaleLowerCase())){
            bestOffer = this.filterBestPrice(_offer,bestOffer,idx);
            bestOffers.push(bestOffer);
        })
      }
    }
    const candidates = [];
    googleOffers.offers.forEach(offer=> {
      const result = offer.merchant.offers.find(merchOffer => {
        return merchOffer.promoPrice === bestOffer.promoPrice;
      });
      result && candidates.push(result);
    })
    try{
      bestOffer.candidates.unshift({link:candidates[0].link, store: candidates[0].store})
    }catch(ex){}

    return config?.isGrocery ? this.getMeanResult(bestOffers) ?? bestOffer: bestOffer;
  };

  private filterBestPrice(offer, bestOffer, idx){
    if(offer.link && offer.normalPrice != '' || offer.normalPrice != '' && offer.store){
      offer.promoPrice = parseFloat((offer.promoPrice).replace('R$','').replace(',','.'));
      bestOffer.promoPrice = parseFloat(bestOffer.promoPrice.toString().replace('R$','').replace(',','.'));
      
      if(offer.promoPrice <= bestOffer.promoPrice){
        if(idx > 1 && bestOffer.promoPrice - offer.promoPrice >= 500) return bestOffer;
        console.log({'best offer: ': offer.promoPrice, store:offer.store });
        if(offer.promoPrice === bestOffer.promoPrice) {
          if(!bestOffer.candidates) bestOffer.candidates = [];
          bestOffer.candidates.push({link:offer.link, store: offer.store, price: offer.promoPrice});
        }
        Object.assign(offer, {candidates: bestOffer.candidates});
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
      offers.push(await this.getPrices(q, { isGrocery: true }));
    });
    return offers;
  };

  private getMeanResult(offers:Offer[]){
    let count = 0;
    offers.forEach(o=>{
      count += parseFloat(o.normalPrice);
    });
    const meanPrice = count / offers.length;
    const meanResult = offers.find(o=>parseFloat(o.normalPrice) >= meanPrice);
    return meanResult;
  }
}

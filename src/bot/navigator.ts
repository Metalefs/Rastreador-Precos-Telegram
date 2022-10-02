import { Page } from "puppeteer-core";
import { parse } from "node-html-parser";
import { navigate } from "./browser";
import { config } from "./config";
import { GoogleShoppingMerchants } from "../models/googleShoppingMerchants";
import { Offer } from "../interfaces/offer";

export async function scoutGoogleShopping(query) {
  return navigate(config.websites.googleShopping(query)).then(
    async ([page, browser]) => {
      const offers: {
        merchant: {
          name:string, 
          id:string,
          offers: Partial<Offer[]>
        }
      }[] = [];
      const baseUrl = (page as unknown as Page).url();
      config.merchants.forEach(async (merchant) => {
        const merchantOffers = getOffersFromMerchant(
          merchant,
          await (page as unknown as Page).content(),
          baseUrl
        );
        offers.push({ merchant: { name: GoogleShoppingMerchants[merchant], id: merchant, offers: merchantOffers }, });
      });
      await (page as unknown as Page).screenshot({
        path: `./src/bot/static/${query}.png`,
        fullPage: true,
      });
      const result = {
        query,
        offers
      }
      await browser.close();
      return result;
    }
  );
}

function getOffersFromMerchant(merchant, html, baseUrl) {
  const root = parse(html);
  const elements = root.querySelectorAll(`[data-merchant-id="${merchant}"]`);
  return elements
    .map((el) => {
      let link = el.getAttribute("href");
      
      const allSpans = el.querySelectorAll("span");
      const allB = el.querySelectorAll("b");
      const promoPriceSpans = el.querySelectorAll("span.T14wmb");
      const normalPriceSpans = el.querySelectorAll("span.Wn67te");
      const storeSpans = el.querySelectorAll("span.E5ocAb");

      let promoPrice = promoPriceSpans[0]?.textContent ?? '';
      let normalPrice = normalPriceSpans[0]?.textContent ?? '';
      const store = storeSpans[0]?.textContent ?? '';

      const promoPriceSecondPriceIdx = promoPrice.lastIndexOf("R$");
      promoPrice = promoPrice.substring(0, promoPriceSecondPriceIdx);

      if(normalPrice === ''){
        try{
          normalPrice = allSpans[0]?.textContent ?? '';
        }catch(ex){}
      }
      if(promoPrice === ''){
        try{
          promoPrice = allB[0]?.textContent ?? '';
        }catch(ex){}
      }
      if(normalPrice === ''){
        try{
          normalPrice = allB[0]?.textContent ?? '';
        }catch(ex){}
      }

      if (link?.startsWith("/")) {
        const url = new URL(baseUrl);
        link = url.origin + link;
        const features = el.text.split('R$')[0];
        el = el.setAttribute('href', link);
        return { link, store, features, promoPrice, normalPrice, html: el.outerHTML };
      }
    })
    .filter((el) => el != undefined);
}

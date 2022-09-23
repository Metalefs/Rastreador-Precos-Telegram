import { Page } from "puppeteer-core";
import { parse } from "node-html-parser";
import { navigate } from "./browser";
import { config } from "./config";
import { GoogleShoppingMerchants } from "./models/googleShoppingMerchants";

export async function scoutGoogleShopping(query) {
  return navigate(config.websites.googleShopping(query)).then(
    async ([page, browser]) => {
      let offers: any = [];
      const baseUrl = (page as unknown as Page).url();
      config.merchants.forEach(async (merchant) => {
        let merchantOffers = getOffersFromMerchant(
          merchant,
          await (page as unknown as Page).content(),
          baseUrl
        );
        offers.push({ merchant: {name: GoogleShoppingMerchants[merchant], id: merchant, offers: merchantOffers}, });
      });
      await (page as unknown as Page).screenshot({
        path: `./src/static/${query}.png`,
        fullPage: true,
      });
      let result = {
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
      if (link?.startsWith("/")) {
        let url = new URL(baseUrl);
        link = url.origin + link;
        const features = el.text.split('R$')[0];
        let store = '';
        let price = '';
        try {
          let currencyIdx = el.text.indexOf('R$')+1;
          let currencyText = el.text.substring(currencyIdx);
          store = currencyText.substring(currencyText.indexOf(',')+3);
          price = 'R'+currencyText.match(/[^A-Z]+/g)![0];
        } catch (ex) {
          price = "not found";
        }
        return { link, store, features, price, html: el.outerHTML };
      }
    })
    .filter((el) => el != undefined);
}

scoutGoogleShopping("Corsair Vengeance 2x4gb 3000mhz").then(res => console.log(JSON.stringify(res, null, 4)));

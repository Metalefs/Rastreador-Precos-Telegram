import { Page } from "puppeteer-core";
import { parse } from "node-html-parser";
import { CloseBrowserWithText, navigate } from "./browser";
import { config } from "./config";
import { Offer } from "src/shared/interfaces/offer";

interface ThisOffer {
  merchant: {
    name: string,
    id: string,
    offers: Partial<Offer[]>
  }
}

export async function scoutGoogleShopping(query, searchconfig = { useMerchants: true }) {
  const result = searchconfig.useMerchants ? await getGoogleMerchantsResult(query) : await getGoogleAnyResult(query);

  return result;
}

async function getGoogleAnyResult(query) {
  const [page, browser] = await navigate(config.websites.googleShopping(query));
  const offers: ThisOffer[] = [];
  const baseUrl = (page as unknown as Page).url();
  const merchantOffers = getOffersData(
    ['.i0X6df', '.a8Pemb.OFFNJ', '.a8Pemb.OFFNJ', '.aULzUe.IuHnof', '.Xjkr3b'],
    await (page as unknown as Page).content(),
    baseUrl
  );
  offers.push({ merchant: { name: 'Any', id: 'Any', offers: merchantOffers }, });
  // await (page as unknown as Page).screenshot({
  //   path: `./src/bot/static/${query}.png`,
  //   fullPage: true,
  // });
  return CloseBrowserWithText(browser as any, {
    query,
    offers
  });
}

async function getGoogleMerchantsResult(query) {
  const [page, browser] = await navigate(config.websites.googleShopping(query));
  const offers: ThisOffer[] = [];
  const baseUrl = (page as unknown as Page).url();
  config.merchants.forEach(async (merchant) => {
    const merchantOffers = getOffersFromMerchant(
      merchant,
      await (page as unknown as Page).content(),
      baseUrl
    );
    offers.push({ merchant: { name: merchantOffers[0]?.store, id: merchant, offers: merchantOffers }, });
  });
  // await (page as unknown as Page).screenshot({
  //   path: `./src/bot/static/${query}.png`,
  //   fullPage: true,
  // }); 
  return CloseBrowserWithText(browser as any, {
    query,
    offers
  });
}

function getOffersFromMerchant(merchant, html, baseUrl) {
  return getOffersData([`[data-merchant-id="${merchant}"]`], html, baseUrl);
}

function getOffersData(selectors = [], html, baseUrl) {
  const root = parse(html);
  const elements = root.querySelectorAll(selectors[0]);
  return elements
    .filter((el) => el != undefined)
    ?.map((el) => {
      if (!el || el === undefined || el == null) return null;

      let link = el.getAttribute("href");

      if (!link) {
        link = el.querySelector('a')?.getAttribute("href");
      }

      const allSpans = el.querySelectorAll("span");
      const allB = el.querySelectorAll("b");
      const promoPriceSpans = el.querySelectorAll(selectors[1] ?? "span.T14wmb");
      const normalPriceSpans = el.querySelectorAll(selectors[2] ?? "span.Wn67te");
      const storeSpans = el.querySelectorAll(selectors[3] ?? "span.E5ocAb");
      let features = el.querySelector(selectors[4] ?? ".sh-np__product-title")?.innerText;

      let promoPrice = promoPriceSpans[0]?.textContent ?? '';
      let normalPrice = normalPriceSpans[0]?.textContent ?? '';
      let store = storeSpans[0]?.text ?? ''

      if (store.startsWith('.') && store.includes('}')) {
        store = store.split('}')[1];
      }

      if (!selectors[1]) {
        const promoPriceSecondPriceIdx = promoPrice.lastIndexOf("R$");
        promoPrice = promoPrice.substring(0, promoPriceSecondPriceIdx);
      }
      else {
        normalPrice = normalPrice.replace('R$ ', '')
      }

      if (normalPrice === '') {
        try {
          normalPrice = allSpans[0]?.textContent ?? '';
        } catch (ex) { }
      }
      if (promoPrice === '') {
        try {
          promoPrice = allB[0]?.textContent ?? '';
        } catch (ex) { }
      }
      if (normalPrice === '') {
        try {
          normalPrice = allB[0]?.textContent ?? '';
        } catch (ex) { }
      }

      normalPrice = normalPrice.replace("R$", '').trim().replace(' ', '.');
      promoPrice = promoPrice.replace("R$", '').trim().replace(' ', '.');

      if (link?.startsWith("/")) {
        const url = new URL(baseUrl);
        link = url.origin + link;
        features = features ?? el.innerText.split('R$')[0];
        el = el.setAttribute('href', link);
        return { link, store, features, promoPrice, normalPrice, html: el.outerHTML };
      }
    })
    .filter((el) => el != undefined);
}

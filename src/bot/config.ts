import { GoogleShoppingMerchants } from "../shared/models/googleShoppingMerchants"
import { Store } from "../shared/models/stores"

export const config = {
    localTunnelDomain: 'shoppinglistchanbot',
    serverUrl: 'https://shopping-tracker-bot.herokuapp.com',

    websites: {
        googleShopping: function (query) {
            return `https://www.google.com.br/search?&tbm=shop&q=${query.replace(/\s/g,'+')}&lr=&cr=countryBR&safe=high&glp=1&adtest=on&hl=PT&tci=g:2076&uule=w+CAIQICIGQnJhemls&tbs=lr:lang_1PT,ctr:countryBR&source=lnms&sa=X&ved=2ahUKEwjn26PfkpX7AhVDLrkGHUTSBdkQ_AUoAXoECAIQAw&biw=2513&bih=937&dpr=1`
        }
    },
    acceptedStores: [
        Store.Amazon,
        Store["Casas Bahia"],
        Store["Magazine Luisa"],
        Store["Mercado Livre"],
        Store["Ponto Frio"],
        Store.Americanas,
        Store["Extra"],
        Store["Kabum"],
    ],
    merchants: [
        GoogleShoppingMerchants.Amazon,
        GoogleShoppingMerchants["Casas Bahia"],
        GoogleShoppingMerchants["Magazine Luisa"],
        GoogleShoppingMerchants["Mercado Livre"],
        GoogleShoppingMerchants["Ponto Frio"],
        GoogleShoppingMerchants.Americanas,
        GoogleShoppingMerchants.Extra,
        GoogleShoppingMerchants.Kabum,
    ]
}
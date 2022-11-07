import { GoogleShoppingMerchants } from "../shared/models/googleShoppingMerchants"
import { Store } from "../shared/models/stores"

export const config = {
    localTunnelDomain: 'shoppinglistchanbot',
    serverUrl: 'https://shopping-tracker-bot.herokuapp.com',

    websites: {
        googleShopping: function (query) {
            return `https://www.google.com.br/search?&tbm=shop&q=${query.replace(/\s/g,'+')}&lr=&cr=countryBR&safe=high&glp=1&hl=PT&tci=g:2076&uule=w+CAIQICIGQnJhemls&tbs=lr:lang_1PT,ctr:countryBR&source=lnms&sa=X&ved=2ahUKEwjn26PfkpX7AhVDLrkGHUTSBdkQ_AUoAXoECAIQAw&biw=2513&bih=937&dpr=1`
        },
        googleGroceryShopping: function (query) {
            return `https://www.google.com.br/search?q=${query.replace(/\s/g,'+')}&glp=1&hl=pt&gl=br&pws=1&uule=w+CAIQICIGQnJhemls&sxsrf=ALiCzsY_5YGMLFcnG-PUMnvkJLZPBAOMLw:1667854327754&source=lnms&tbm=shop&sa=X&ved=2ahUKEwjiqPjF-Zz7AhU0IbkGHelMCvUQ_AUoAXoECAEQAw&biw=1639&bih=909`
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
        GoogleShoppingMerchants.Amazon2,
        GoogleShoppingMerchants["Casas Bahia"],
        GoogleShoppingMerchants["Magazine Luisa"],
        GoogleShoppingMerchants["Mercado Livre"],
        GoogleShoppingMerchants["Ponto Frio"],
        GoogleShoppingMerchants.Americanas,
        GoogleShoppingMerchants.Extra,
        GoogleShoppingMerchants.Kabum,
    ]
}
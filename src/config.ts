import { GoogleShoppingMerchants } from "./models/googleShoppingMerchants"
import { Store } from "./models/stores"

export const config = {
    websites: {
        googleShopping: function (query) {
            return `https://www.google.com.br/search?tbm=shop&q=${query.replace(/\s/g,'+')}`
        }
    },
    acceptedStores: [
        Store.Amazon,
        Store["Casas Bahia"],
        Store["Mercado Livre"],
        Store["Magazine Luisa"]
    ],
    merchants: [
        GoogleShoppingMerchants.Amazon,
        GoogleShoppingMerchants["Casas Bahia"],
        GoogleShoppingMerchants["Magazine Luisa"],
        GoogleShoppingMerchants["Mercado Livre"]
    ]
}
import { Page } from "puppeteer-core";
import { navigate } from "./browser";

export class Buyer {
    cepInputSelector;
    cepButtonSelector;
    buyButtonSelector;
    finishBuyButtonSelector;
    identityInputSelector;
    data: {
        cep: '33233180',
        cpfCnpj: '12512358674'
    };
    constructor(){
        this.buyButtonSelector = 'buy-button';
        this.cepInputSelector = '[data-testid="input-cep"]';
        this.cepButtonSelector = '[data-qa="cep-form-freight-calc"]';
        this.finishBuyButtonSelector = '[data-qa="cart-finish-buy"] > a';
        this.identityInputSelector = '#CpfCnpj';
    }
    buyFromPontoFrio(address){
        navigate(address).then(async([page,browser]) => {
            (page as unknown as Page).click(this.buyButtonSelector);
            (page as unknown as Page).type(this.cepInputSelector,this.data.cep);
            (page as unknown as Page).click(this.cepButtonSelector);

            (page as unknown as Page).click(this.finishBuyButtonSelector);
            
            (page as unknown as Page).type(this.identityInputSelector, this.data.cpfCnpj);
        })
    }
} 
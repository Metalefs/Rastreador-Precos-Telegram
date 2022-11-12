import { Db } from "mongodb";
import { Grocery } from "src/shared/interfaces/grocery";
import { BaseService } from "../../shared/models/base.service";

export class GroceriesService extends BaseService {
  constructor(protected dbconnection: Db) {
    super(dbconnection, "groceries");
  }

  addTolist = async (product, chatId, offer?) => {
    const count = await this.dbconnection
      .collection(this.collection)
      .countDocuments();
    await this.update(
      { name: product },
      {
        name: product,
        chatId,
        date: new Date(),
        id: count,
        offer
      }
    );
  };

  updatelist = async (product, offer?) => {
    const count = await this.dbconnection
      .collection('groceries')
      .countDocuments();

    const priceHistory = product.priceHistory ?? [];
    priceHistory.push({
      date: new Date(),
      price: offer.promoPrice || offer.normalPrice
    });

    await this.update(
      { name: product },
      {
        date: new Date(),
        id: count,
        offer,
        priceHistory
      }
    );
  };

  async addManualPrice(name, price){
    await this.update({name},{manualPrice: price});
  }

  async addToCategory(product, category) {
    await this.update({ name: product }, { category });
  }

  async addQuantity(product, quantity) {
    await this.update({ name: product }, { quantity });
  }

  async addToBrand(product, brand) {
    await this.update({ name: product }, { brand });
  }

  async totalCostbyChatId(chatId){
    const list = await this.findByChatId(chatId) as unknown as Grocery[];
    let value = 0;
    list.forEach((item: any) => {
      if(item.offer?.normalPrice.includes('.') && item.offer?.normalPrice.includes(','))
        item.offer.normalPrice = item.offer?.normalPrice.replace('.','').replace(',','.');
      if(item.offer?.normalPrice.includes(','))
        item.offer.normalPrice = item.offer?.normalPrice.replace(',','.');

      value += parseFloat(item.offer?.normalPrice?.replace('R$','').trim().replace(' ','') ?? item.manualPrice ?? '0') * (item.quantity || 1);
    })
    return value;
  }
}

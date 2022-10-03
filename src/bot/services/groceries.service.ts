import { Db } from "mongodb";
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

  async addToCategory(product, category) {
    await this.update({ name: product }, { category });
  }

  async addToBrand(product, brand) {
    await this.update({ name: product }, { brand });
  }
}

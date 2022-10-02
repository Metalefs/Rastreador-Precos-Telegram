import moment from "moment";
import { Db } from "mongodb";
import { BaseService } from "../../models/base.service";

export class ProductsService extends BaseService {
  constructor(protected dbconnection: Db) {
    super(dbconnection, "wishlist");
  }

  addTowishlist = async (product, chatId, offer?) => {
    const count = await this.dbconnection
      .collection("wishlist")
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

  updatewishlist = async (product, offer?) => {
    const count = await this.dbconnection
      .collection('wishlist')
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

  removeWishlist = async (id) => {
    const result = await this.dbconnection
      .collection("wishlist")
      .deleteOne({ name: id });
    if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.", id);
    } else {
      console.log("No documents matched the query. Deleted 0 documents.", {
        id,
      });
    }
  };

  getWishlist = async (chatId) => {
    return this.dbconnection.collection("wishlist").find({ chatId }).toArray();
  };

  getWishlistFromAllChats = async () => {
    return this.dbconnection.collection("wishlist").find().toArray();
  };

  getWishlistItemById = async (id) => {
    return this.dbconnection
      .collection("wishlist")
      .find({ id: parseInt(id) })
      .toArray();
  };

  getWishlistByName = async (name) => {
    return this.dbconnection.collection("wishlist").findOne({ name: name });
  };

  emptyWishlist = async () => {
    return this.dbconnection.collection("wishlist").deleteMany((x) => x);
  };

  async addToCategory(product, category) {
    await this.update({ name: product }, { category });
  }
}

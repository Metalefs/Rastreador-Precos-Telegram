import moment from "moment";
import { Db } from "mongodb";
import { PriceFinder } from "../getBestPrices";
import { ProductsService } from "./wishlist.service";

export class SearchService {
  constructor(private dbconnection: Db) {}

  async search(force = false) {
    let offers: any = [];

    //if ((await this.hasSearchedToday()) && !force) return;

    const productsService = new ProductsService(this.dbconnection);
    const products = await productsService.getWishlistFromAllChats();

    const priceFinder = new PriceFinder(this.dbconnection);

    products.forEach(async (product) => {
      offers.push(await priceFinder.getPrices(product.name));
    });

    await this.logSearch();
  }

  private async logSearch() {
    this.dbconnection.collection("searches").insertOne({
      date: new Date(),
    });
  }

  async hasSearchedToday() {
    const lastSearch = await this.getLastSearch();

    return (
      lastSearch && moment(new Date(lastSearch.date)).isSame(new Date(), "day")
    );
  }

  
  async getLastSearch(){
    return this.dbconnection
    .collection("searches")
    .find()
    .sort("date", -1)
    .toArray()[0];
  }
}

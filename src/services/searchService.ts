import moment from "moment";
import { Db } from "mongodb";
import { PriceFinder } from "../getBestPrices";
import { Product } from "../interfaces/product";
import { ProductEnrichmentService } from "./productEnrichment.service";
import { ProductsService } from "./wishlist.service";

export class SearchService {
  constructor(private dbconnection: Db) {}

  async search(force = false) {
    let offers: any = [];

    //if ((await this.hasSearchedToday()) && !force) return;

    const productsService = new ProductsService(this.dbconnection);
    const priceFinder = new PriceFinder(this.dbconnection);
    const products = await productsService.getWishlistFromAllChats();

    const productEnrichmentService = new ProductEnrichmentService(priceFinder,productsService);

    products.forEach(async (product) => {
      offers.push(await productEnrichmentService.enrich(product as unknown as Product));
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

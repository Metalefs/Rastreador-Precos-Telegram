import moment from "moment";
import { Db } from "mongodb";
import { PriceFinder } from "../getBestPrices";
import { Product } from "../../shared/interfaces/product";
import { PriceHistoryService } from "./priceHistory.service";
import { ProductEnrichmentService } from "./productEnrichment.service";
import { ProductsService } from "./wishlist.service";
import { GroceriesService } from "./groceries.service";

export class SearchService {
  constructor(private dbconnection: Db) {}

  async search(force = false) {
    const offers: any = [];

    const productsService = new ProductsService(this.dbconnection);
    const groceriesService = new GroceriesService(this.dbconnection);
    const priceFinder = new PriceFinder(this.dbconnection);
    const priceHistoryService = new PriceHistoryService(this.dbconnection);
    const products = await productsService.list();
    const groceries = await groceriesService.list();

    const productEnrichmentService = new ProductEnrichmentService(priceFinder,productsService,groceriesService,priceHistoryService);

    groceries.forEach(async (product) => {
      offers.push(await productEnrichmentService.enrichGrocery(product as unknown as Product));
    });
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

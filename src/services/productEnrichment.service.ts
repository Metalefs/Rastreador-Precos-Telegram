import { PriceFinder } from "../getBestPrices";
import { Product } from "../interfaces/product";
import { ProductsService } from "./wishlist.service";

export class ProductEnrichmentService {
  constructor(private priceFinder: PriceFinder, private productService: ProductsService) {
  }

  async enrich(product:Product, chatId?) {
    const result = await this.priceFinder.getPrices(product.name);

    this.productService.updatewishlist(product.name, result);
  }
}

import { PriceFinder } from '../getBestPrices';
import { Product } from '../../interfaces/product';
import { PriceHistoryService } from './priceHistory.service';
import { ProductsService } from './wishlist.service';

export class ProductEnrichmentService {
  constructor(
    private priceFinder: PriceFinder,
    private productService: ProductsService,
    private priceHistoryService: PriceHistoryService,
  ) {}

  async enrich(product: Product, chatId?) {
    const result = await this.priceFinder.getPrices(product.name);

    this.productService.updatewishlist(product.name, result);

    this.priceHistoryService.add({
      product: product.name,
      date: new Date(),
      promoPrice: result.promoPrice,
      normalPrice: result.normalPrice,
      store: result.store,
    });
  }
}
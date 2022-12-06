import { PriceFinder } from '../getBestPrices';
import { Product } from '../../shared/interfaces/product';
import { PriceHistoryService } from './priceHistory.service';
import { ProductsService } from './wishlist.service';
import { Grocery } from 'src/shared/interfaces/grocery';
import { GroceriesService } from './groceries.service';
import { Offer } from 'src/shared/interfaces/offer';

export class ProductEnrichmentService {
  constructor(
    private priceFinder: PriceFinder,
    private productService: ProductsService,
    private groceryService: GroceriesService,
    private priceHistoryService: PriceHistoryService,
  ) {}

  async enrich(product: Product, chatId?) {
    const result:Offer = await this.priceFinder.getPrices(product.name, {minPrice: product.minPrice, maxPrice:product.maxPrice});
    console.log({result})
    if(!result.link){
      console.error('could not find offers for '+product.name)
      return;
    }

    await this.productService.updatewishlist(product.name, result);

    this.priceHistoryService.add({
      product: product.name,
      date: new Date(),
      promoPrice: result.promoPrice,
      normalPrice: result.normalPrice,
      store: result.store,
      html: result.html,
      link: result.link
    });
  }

  async enrichGrocery(product: Grocery, chatId?) {
    const result:Offer = await this.priceFinder.getPrices(product.name + " "+ product.brand ?? '', {isGrocery : true});
    console.log({result})
    if(!result.link){
      console.error('could not find offers for '+product.name)
      return;
    }

    await this.groceryService.updatelist(product.name, result);

    this.priceHistoryService.add({
      product: product.name,
      date: new Date(),
      promoPrice: result.promoPrice,
      normalPrice: result.normalPrice,
      store: result.store,
      html: result.html,
      link: result.link
    });
  }
}

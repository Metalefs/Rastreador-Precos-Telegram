import { PriceFinder } from "../getBestPrices";
import { uploadProductScreenshot, uploadWishlistScreenshot } from "./files";
import { ProductsService } from "./products";

export class BotService {
  constructor(private bot, private productService: ProductsService, private priceFinder: PriceFinder) {}

  searchWishlist = async (msg,match) => {
    const [chatId, resp] = [
      msg.chat.id,
      match[1] /*the captured "command"*/,
    ];

    let products = await this.productService.getWishlist();
    console.log(products)
    const offers = this.priceFinder.getPrices(products.map(prd=>prd.name));

    this.bot.sendMessage(chatId, JSON.stringify(offers, undefined, 4));
  }

  addWishlist = async (msg, match) => {
    const [chatId, productName] = [
      msg.chat.id,
      match[1] /*the captured "command"*/,
    ];

    this.productService.addTowishlist(productName);

    let products = await this.productService.getWishlist();

    const path = await uploadWishlistScreenshot(products);
    
    this.bot.sendMessage(chatId, 'https://96a6-2804-296c-2103-e07-1dc7-7aac-dc27-f051.sa.ngrok.io/'+path);
  };

  listProducts = async (msg, match) => {
    const [chatId, resp] = [msg.chat.id, match[1]];
    let products = await this.productService.list();
    let result = await uploadProductScreenshot(products);

    this.bot.sendPhoto(msg.chat.id, result);
  };
}

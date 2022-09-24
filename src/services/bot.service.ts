import { PriceFinder } from "../getBestPrices";
import { uploadProductScreenshot, uploadWishlistScreenshot } from "./files";
import { ProductsService } from "./products";

export class BotService {
  constructor(private bot, private productService: ProductsService, private priceFinder: PriceFinder) { }

  start = async (msg, match) => {
    const [chatId] = [
      msg.chat.id
    ];

    let commands = [
      ["/wishlist"],
      ["/addWishlist"],
      ["/addWishlist new Iphone"],
      ["/searchWishlist"],
      ["/removeWishlist 0"],
      ["/emptyWishlist"],
      ["/products"]
    ];

    this.bot.sendMessage(chatId, "Bem vindo!", {
      "reply_markup": {
        "keyboard": commands
      }
    });
  }

  searchWishlist = async (msg, match) => {
    const [chatId, resp] = [
      msg.chat.id,
      match[1] /*the captured "command"*/,
    ];

    let products = await this.productService.getWishlist();
    const offers = await this.priceFinder.getPrices(products.map(prd => prd.name));

    this.bot.sendMessage(chatId, JSON.stringify(offers, undefined, 4));
  }

  addWishlist = async (msg, match) => {
    const [chatId, productName] = [
      msg.chat.id,
      match[1] /*the captured "command"*/,
    ];

    if (productName === undefined) {
      this.bot.sendMessage(chatId, 'Esse comando precisa de um argumento. Ex: /wishlist caderno do zachbell');
      return;
    }

    await this.productService.addTowishlist(productName);
    const [path] = await this.getWishlistScreenshot();

    this.bot.sendPhoto(chatId, path, { caption: "Aqui está a sua lista !" });
  };

  showWishlist = async (msg, match) => {
    const [chatId] = [
      msg.chat.id,
    ];
    const [path] = await this.getWishlistScreenshot();
    this.bot.sendPhoto(chatId, path, { caption: "Aqui está a sua lista !" });
  }

  removeWishlist = async (msg, match) => {
    const [chatId, id] = [
      msg.chat.id,
      match[1] /*the captured "command"*/,
    ];

    if (!id) {
      this.bot.sendMessage(chatId, 'Esse comando precisa de um argumento. Ex: /wishlist {{id}}');
      return;
    }

    await this.productService.removeWishlist(id);
    const [path] = await this.getWishlistScreenshot();

    this.bot.sendPhoto(chatId, path, { caption: "Aqui está a sua lista !" });
  };

  emptyWishlist = async (msg, match) => {
    const [chatId, resp] = [
      msg.chat.id,
      match[1] /*the captured "command"*/,
    ];
    await this.productService.emptyWishlist();
    this.bot.sendMessage(chatId, 'Lista apagada com sucesso.');
  }

  listProducts = async (msg, match) => {
    const [chatId, resp] = [msg.chat.id, match[1]];
    let products = await this.productService.list();
    let result = await uploadProductScreenshot(products);

    this.bot.sendPhoto(msg.chat.id, result);
  };

  private async getWishlistScreenshot() {
    let products = await this.productService.getWishlist();
    const path = await uploadWishlistScreenshot(products);
    return [path, products];
  }
}

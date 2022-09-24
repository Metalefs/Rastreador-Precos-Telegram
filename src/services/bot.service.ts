import { PriceFinder } from "../getBestPrices";
import { botCommands } from "../models/commandsEnum";
import { CategoriesService } from "./categories";
import { uploadProductScreenshot, uploadWishlistScreenshot } from "./files";
import { ProductsService } from "./products";

export class BotService {
  constructor(
    private bot,
    private productService: ProductsService,
    private categoryService: CategoriesService,
    private priceFinder: PriceFinder
  ) {}

  start = async (msg, match) => {
    const [chatId] = [msg.chat.id];

    let commands = [
      ["/mywishlist"],
      ["/addwishlist"],
      ["/addwishlist new Iphone"],
      ["/enrich"],
      ["/searchwishlist 0"],
      ["/removewishlist 0"],
      ["/emptywishlist"],
      ["/wishlistOffers"],
    ];

    this.bot.sendMessage(chatId, "Bem vindo!", {
      reply_markup: {
        keyboard: commands,
      },
    });
  };

  enrich = async (msg, match) => {
    const [chatId, idx] = this.parseChat(msg, match);

    let products = await this.productService.getWishlist();
    const offers = await this.priceFinder.getPrices(
      products.map((prd) => prd.name)
    );

    this.bot.sendMessage(chatId, JSON.stringify(offers, undefined, 4));
  };

  searchwishlist = async (msg, match) => {
    const [chatId, idx] = this.parseChat(msg, match);

    if (idx === undefined) {
      this.bot.on("callback_query", (callBackQuery) => {
        const callBackData = callBackQuery.data;
        console.log(callBackData);
        this.bot.answerCallbackQuery(callBackQuery.id).then((e) => {
          this.bot.sendMessage(chatId, "teste");
        });
      });
      return;
    }

    let products = await this.productService.getWishlistById(idx);
    const offers = await this.priceFinder.getPrices(
      products.map((prd) => prd.name)
    );

    this.bot.sendMessage(chatId, JSON.stringify(offers, undefined, 4));
  };

  addwishlist = async (msg, match) => {
    const chatId = msg.chat.id;
    const productName = match.input.replace("/addwishlist", "");
    if (productName === "") {
      this.bot.sendMessage(
        chatId,
        "Por favor, forneca o nome de um produto. Ex: /addwishlist caderno do zachbell"
      );
      return;
    }

    await this.productService.addTowishlist(productName);
    const [path] = await this.getWishlistScreenshot();

    const categories = await this.categoryService.list();
    const options = categories.map((cat) => {
      return {
        text: cat.name,
        callback_data: JSON.stringify({
          c: botCommands["addwishlist"], //command
          d: productName, //data
          a: cat.name, //answer
        }),
      };
    });

    this.bot.sendPhoto(chatId, path, {
      caption: "Aqui está a sua lista",
    });
    this.bot.sendMessage(chatId, "Defina uma categoria para o produto:", {
      reply_markup: {
        inline_keyboard: [
          options,
        ],
        resize_keyboard: true,
        "one_time_keyboard": true,
      },
    });
  };

  mywishlist = async (msg, match) => {
    const [chatId] = this.parseChat(msg, match);
    const [path] = await this.getWishlistScreenshot();
    this.bot.sendPhoto(chatId, path, { caption: "Aqui está a sua lista !" });
  };

  removewishlist = async (msg, match) => {
    const [chatId, id] = this.parseChat(msg, match);

    if (!id) {
      this.bot.sendMessage(
        chatId,
        "Esse comando precisa de um argumento. Ex: /wishlist {{id}}"
      );
      return;
    }

    await this.productService.removeWishlist(id);
    const [path] = await this.getWishlistScreenshot();

    this.bot.sendPhoto(chatId, path, { caption: "Aqui está a sua lista !" });
  };

  emptywishlist = async (msg, match) => {
    const [chatId, resp] = this.parseChat(msg, match);
    await this.productService.emptyWishlist();
    this.bot.sendMessage(chatId, "Lista apagada com sucesso.");
  };

  wishlistOffers = async (msg, match) => {
    const [chatId, resp] = this.parseChat(msg, match);
    let products = await this.productService.list();
    let result = await uploadProductScreenshot(products);

    this.bot.sendPhoto(msg.chat.id, result);
  };

  async addProductToCategory(product, category){
    return this.productService.addToCategory(product,category);
  }

  private parseChat(msg, match) {
    return [msg.chat.id, match[1]];
  }

  private async getWishlistScreenshot() {
    let products = await this.productService.getWishlist();
    const path = await uploadWishlistScreenshot(products);
    return [path, products];
  }
}

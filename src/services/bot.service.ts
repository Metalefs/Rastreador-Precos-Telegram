import { uploadProductScreenshot } from "./files";
import { ProductsService } from "./products";

export class BotService {
  constructor(private bot, private productService: ProductsService) {}

  addProduct = (msg, match) => {
    const [chatId, productName] = [
      msg.chat.id,
      match[1] /*the captured "command"*/,
    ];

    this.bot.sendMessage(chatId, "Qual é o nome do produto");
  };

  listProducts = async (msg, match) => {
    const [chatId, resp] = [msg.chat.id, match[1]];
    let products = await this.productService.list();
    let result = await uploadProductScreenshot(products);

    this.bot.sendPhoto(msg.chat.id, result);
  };
}

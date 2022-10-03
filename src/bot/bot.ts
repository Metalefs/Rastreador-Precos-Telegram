require("dotenv").config();

// Create a bot that uses 'polling' to fetch new updates
import { BotService } from "./services/bot.service";
import { ChatIdService } from "./services/chatId.service";

export const init = (bot, botService: BotService, chatIdService:ChatIdService) => {
  bot.onText(/\/start/, botService.start);

  bot.onText(/\/setincome/, botService.setincome);
  bot.onText(/\/mybudget/, botService.mybudget);
  bot.onText(/\/futureexpenses/, botService.futureexpenses);

  bot.onText(/\/addwishlist/, botService.addwishlist);
  bot.onText(/\/mywishlist/, botService.mywishlist);

  bot.onText(/\/addgrocery/, botService.addgrocery);
  bot.onText(/\/mygroceries/, botService.mygroceries);

  bot.onText(/\/enrich/, botService.enrich);
  bot.onText(/\/enrichitem (.+)/, botService.enrichitem);

  bot.onText(/\/removewishlist (.+)/, botService.removewishlist);
  bot.onText(/\/emptywishlist/, botService.emptywishlist);

  bot.onText(/\/emptygroceries/, botService.emptygroceries);

  bot.onText(/\/wishlistoffers/, botService.wishlistoffers);
  bot.onText(/\/groceryoffers/, botService.groceryoffers);

  bot.on('callback_query', async (callbackQuery) => {
    const message = callbackQuery.message;
    const data = JSON.parse(callbackQuery.data);

    await botService.addProductToCategory(data.d, data.a);

    bot.sendMessage(
      message.chat.id,
      `Produto foi rotulado com a categoria "${data.a}"`
    );
  });

  bot.on('message', async(msg) => {
    const chatId = msg.chat.id;
    await chatIdService.add(msg);
    const nextMsg = bot.nextMessage[chatId];
    if (nextMsg) {
      nextMsg.callback(msg);
      nextMsg.next(msg);
      bot.nextMessage[chatId] = undefined;
    }
  })
};

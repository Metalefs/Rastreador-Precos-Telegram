require("dotenv").config();

// Create a bot that uses 'polling' to fetch new updates
import { BotService } from "./services/bot.service";

export const init = (bot, botService: BotService) => {
  bot.onText(/\/start/, botService.start);

  bot.onText(/\/addwishlist/, botService.addwishlist);

  bot.onText(/\/mywishlist/, botService.mywishlist);

  bot.onText(/\/enrich/, botService.enrich);

  bot.onText(/\/searchwishlist  (.+)/, botService.searchwishlist);

  bot.onText(/\/removewishlist (.+)/, botService.removewishlist);

  bot.onText(/\/emptywishlist/, botService.emptywishlist);

  bot.onText(/\/wishlistOffers/, botService.wishlistOffers);

  bot.on('callback_query', async (callbackQuery) => {
    const message = callbackQuery.message;
    const data = JSON.parse(callbackQuery.data);

    await botService.addProductToCategory(data.d,data.a);
  
    bot.sendMessage(message.chat.id, `Produto foi rotulado com a categoria "${data.a}"`);
 });
};

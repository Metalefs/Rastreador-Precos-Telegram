require("dotenv").config();

// Create a bot that uses 'polling' to fetch new updates
import { BotService } from "./services/bot.service";


export const init = (bot, botService:BotService) => {
    bot.onText(/\/wishlist (.+)/, botService.addWishlist);

    bot.onText(/\/runWishlist/, botService.searchWishlist);

    bot.onText(/\/products/, botService.listProducts);
}
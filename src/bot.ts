require("dotenv").config();

// Create a bot that uses 'polling' to fetch new updates
import { BotService } from "./services/bot.service";


export const init = (bot, botService:BotService) => {
    bot.onText(/\/start/, botService.start);

    bot.onText(/\/addWishlist (.+)/, botService.addWishlist);
    
    bot.onText(/\/wishlist/, botService.showWishlist);

    bot.onText(/\/searchWishlist/, botService.searchWishlist);
    
    bot.onText(/\/removeWishlist (.+)/, botService.removeWishlist);

    bot.onText(/\/emptyWishlist/, botService.emptyWishlist);

    bot.onText(/\/products/, botService.listProducts);
}
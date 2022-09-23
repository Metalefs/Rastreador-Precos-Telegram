require("dotenv").config();

// Create a bot that uses 'polling' to fetch new updates
import { BotService } from "./services/bot.service";


export const init = (bot, botService:BotService) => {
    bot.onText(/\/find-product/, botService.addProduct);

    bot.onText(/\/products/, botService.listProducts);
}
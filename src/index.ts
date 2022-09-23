require("dotenv").config();
import TelegramBot from "node-telegram-bot-api";

import { init } from "./bot";
import { dbconnection } from "./database";
import { BotService } from "./services/bot.service";
import { ProductsService } from "./services/products";

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const productService = new ProductsService(dbconnection)

const botService = new BotService(bot, productService);

init(bot,botService);
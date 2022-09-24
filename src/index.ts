require("dotenv").config();
import { Db, MongoClient } from "mongodb";
import TelegramBot from "node-telegram-bot-api";

import { init } from "./bot";
import { dbconnection } from "./database";
import { PriceFinder } from "./getBestPrices";
import { BotService } from "./services/bot.service";
import { CategoriesService } from "./services/categories";
import { ExpensesService } from "./services/expenses";
import { ProductsService } from "./services/products";

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

async function main() {

    dbconnection().then(([db,connection]) => {
        const productService = new ProductsService(db as unknown as Db);
        const categoryService = new CategoriesService(db as unknown as Db);
        const expenseService = new ExpensesService(db as unknown as Db);
        const priceFinder = new PriceFinder(db as unknown as Db);
        const botService = new BotService(bot, productService, categoryService, expenseService, priceFinder);
        init(bot, botService);


        // When the mongodb server goes down, the driver emits a 'close' event
        (connection as MongoClient).on('close', () => { console.log('-> lost connection'); });
        // The driver tries to automatically reconnect by default, so when the
        // server starts the driver will reconnect and emit a 'reconnect' event.
        (connection as MongoClient).on('reconnect', () => { console.log('-> reconnected'); });
    })

}

main();
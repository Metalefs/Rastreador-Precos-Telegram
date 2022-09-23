require("dotenv").config();

import TelegramBot from "node-telegram-bot-api";
import * as fs from "fs";
import { dbconnection } from "./database";

import { takeScreenshotFromHtml } from "./browser";
import { upload } from "./images";
import { createProductTable } from "./util";

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN;

dbconnection().then((db) => {
  // Create a bot that uses 'polling' to fetch new updates
  const bot = new TelegramBot(token, { polling: true });

  bot.onText(/\/add-product/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const [chatId, resp] = [msg.chat.id, match[1] /*the captured "whatever"*/];

    bot.sendMessage(chatId, "Qual é o nome do produto");
  });

  bot.onText(/\/products/, async (msg, match) => {
    const [chatId, resp] = [msg.chat.id, match[1] /*the captured "whatever"*/];

    let products = [... new Set((await db.collection("products").find().toArray()).map((item) => item.products).flat())];
   
    let productsHTML = createProductTable(products);
    let image = await takeScreenshotFromHtml(productsHTML);

    fs.writeFileSync("./src/static/image.png", image);
    let result = await upload("./src/static/image.png");

    console.log(result);

    bot.sendPhoto(msg.chat.id, result);
  });
});

import * as fs from "fs";

import { takeScreenshotFromHtml } from "../browser";
import { upload } from "./images";
import { createProductTable, createWishlistTable } from "../util";
import randomstring from 'randomstring';

export  const uploadProductScreenshot = async (products) => {
  let image = await takeScreenshotFromHtml(createProductTable(products));

  fs.writeFileSync("./src/static/image.png", image);
  //return await upload("./src/static/image.png");
  return 'https://96a6-2804-296c-2103-e07-1dc7-7aac-dc27-f051.sa.ngrok.io/image.png';
};

export  const uploadWishlistScreenshot = async (products) => {
  let image = await takeScreenshotFromHtml(createWishlistTable(products));
  const rand = randomstring.generate();
  fs.writeFileSync(`./src/static/wishlist${rand}.png`, image);
  return `https://96a6-2804-296c-2103-e07-1dc7-7aac-dc27-f051.sa.ngrok.io/wishlist${rand}.png`;
};
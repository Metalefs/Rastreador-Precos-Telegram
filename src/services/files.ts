import * as fs from "fs";

import { takeScreenshotFromHtml } from "../browser";
//import { upload } from "./images";
import { createProductTable, createWishlistTable } from "../util";
import randomstring from 'randomstring';

const fileServerUrl = 'https://8503-2804-296c-2103-e07-2184-f0dd-96de-966e.sa.ngrok.io';

export  const uploadProductScreenshot = async (products) => {
  let image = await takeScreenshotFromHtml(createProductTable(products));

  fs.writeFileSync("./src/static/image.png", image);
  //return await upload("./src/static/image.png");
  return fileServerUrl+'/image.png';
};

export  const uploadWishlistScreenshot = async (products) => {
  let image = await takeScreenshotFromHtml(createWishlistTable(products));
  const rand = randomstring.generate();
  fs.writeFileSync(`./src/static/wishlist${rand}.png`, image);
  return fileServerUrl+`/wishlist${rand}.png`;
};
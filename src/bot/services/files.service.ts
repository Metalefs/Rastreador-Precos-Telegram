import * as fs from "fs";

import { takeScreenshotFromHtml } from "../browser";
//import { upload } from "./images";
import { createProductTable, createWishlistTable } from "../util";
import * as randomstring from 'randomstring';

const fileServerUrl = 'https://7a4b-2804-296c-2103-d5dc-5d35-8a46-1c9e-e432.sa.ngrok.io';

export const uploadProductTableScreenshot = async (products,chatId) => {
  const image = await takeScreenshotFromHtml(createProductTable(products));
  const path = saveFile(`product-table-${chatId}`,'png',image);
  //return await upload('./src/static/'+path);
  return fileServerUrl+'/'+path;
};

export const uploadProductTableHTML = async (products, chatId) => {
  const html = createProductTable(products);
  const path = saveFile(`product-table-${chatId}`,'html',html);
  //return await upload('./src/static/'+path);
  return fileServerUrl+'/'+chatId;
}

export  const uploadWishlistTableScreenshot = async (products, chatId) => {
  const image = await takeScreenshotFromHtml(createWishlistTable(products));
  const path = saveFile(`wishlist-${chatId}`,'png',image);
  //return await upload('./src/static/'+path);
  return fileServerUrl+'/'+path;
};

export  const uploadWishlistTableHTML = async (products, chatId) => {
  const html = createWishlistTable(products);
  const path = saveFile(`wishlist-${chatId}`,'html',html);
  //return await upload('./src/static/'+path);
  return fileServerUrl+'/'+chatId;
};

function saveFile(name,ext,data){
  const rand = randomstring.generate();
  const basePath = './public/';
  const path = `${basePath}${name}-${rand}.${ext}`;
  fs.writeFileSync(path, data);
  return `public/${name}-${rand}.${ext}`;
}
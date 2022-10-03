import * as fs from "fs";

import { takeScreenshotFromHtml } from "../browser";
//import { upload } from "./images";
import { createGroceriesTable, createOffersTable, createWishlistTable } from "../html-generator";
import * as randomstring from 'randomstring';
import { config } from "../config";

const fileServerUrl = config.fileServerUrl;

export const uploadOffersTableScreenshot = async (products,chatId) => {
  const image = await takeScreenshotFromHtml(createOffersTable(products));
  const path = saveFile(`offer-table-${chatId}`,'png',image);
  //return await upload('./src/static/'+path);
  return fileServerUrl+'/'+path;
};

export const uploadOffersTableHTML = async (products, chatId) => {
  const html = createOffersTable(products);
  const path = saveFile(`offer-table-${chatId}`,'html',html);
  //return await upload('./src/static/'+path);
  return fileServerUrl+'/'+chatId+'/offers';
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
  return fileServerUrl+'/'+chatId+'/offers';
};

export const uploadGroceriesTableScreenshot = async (products,chatId) => {
  const image = await takeScreenshotFromHtml(createGroceriesTable(products));
  const path = saveFile(`groceries-table-${chatId}`,'png',image);
  //return await upload('./src/static/'+path);
  return fileServerUrl+'/'+chatId+'/groceries';
};


function saveFile(name,ext,data){
  const rand = randomstring.generate();
  const basePath = './public/';
  const path = `${basePath}${name}-${rand}.${ext}`;
  fs.writeFileSync(path, data);
  return `public/${name}-${rand}.${ext}`;
}
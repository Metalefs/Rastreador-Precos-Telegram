import * as fs from "fs";

import { takeScreenshotFromHtml } from "../browser";
//import { upload } from "./images";
import { createGroceriesTable, createOffersTable, createWishlistTable } from "../html-generator";
import * as randomstring from 'randomstring';

export class FileService{
  constructor(private serverUrl:string){

  }
  uploadOffersTableScreenshot = async (products,chatId) => {
    const image = await takeScreenshotFromHtml(createOffersTable(products));
    const path = this.saveFile(`offer-table-${chatId}`,'png',image);
    //return await upload('./src/static/'+path);
    return this.serverUrl+'/'+path;
  };
  
  uploadOffersTableHTML = async (products, chatId) => {
    const html = createOffersTable(products);
    const path = this.saveFile(`offer-table-${chatId}`,'html',html);
    //return await upload('./src/static/'+path);
    //return this.serverUrl+'/'+chatId+'/offers';
    return this.serverUrl+'/'+path;
  }
  
  uploadWishlistTableScreenshot = async (products, chatId) => {
    const image = await takeScreenshotFromHtml(createWishlistTable(products));
    const path = this.saveFile(`wishlist-${chatId}`,'png',image);
    //return await upload('./src/static/'+path);
    return this.serverUrl+'/'+path;
  };
  
  uploadWishlistTableHTML = async (products, chatId) => {
    const html = createWishlistTable(products);
    const path = this.saveFile(`wishlist-${chatId}`,'html',html);
    //return await upload('./src/static/'+path);
    //return this.serverUrl+'/'+chatId+'/offers';
    return this.serverUrl+'/'+path;
  };
  
  uploadGroceriesTableScreenshot = async (products,chatId) => {
    const image = await takeScreenshotFromHtml(createGroceriesTable(products));
    const path = this.saveFile(`groceries-table-${chatId}`,'png',image);
    //return await upload('./src/static/'+path);
    //return this.serverUrl+'/'+chatId+'/groceries';
    return this.serverUrl+'/'+path;
  };
  
  
  private saveFile(name,ext,data){
    const rand = randomstring.generate();
    const basePath = './public/';
    const path = `${basePath}${name}-${rand}.${ext}`;
    fs.writeFileSync(path, data);
    return `public/${name}-${rand}.${ext}`;
  }
}
import * as fs from "fs";

const BYTES_PER_MB = 1024 ** 2;
const MAX_SIZE_IN_MB = 5;
import { takeScreenshotFromHtml } from "../browser";
import { createGroceriesTable, createOffersTable, createWishlistTable } from "../html-generator";
import * as randomstring from 'randomstring';
import { upload } from "./images.service";

export class FileService{
  constructor(private serverUrl:string){

  }
  uploadOffersTableScreenshot = async (products,chatId) => {
    const image = await takeScreenshotFromHtml(createOffersTable(products));
    const path = this.saveFile(`o-${chatId}`,'png',image);
    //return [this.serverUrl, await upload('./'+path,`offer-table-${chatId}`)];
    return [this.serverUrl,this.serverUrl+'/'+path];
  };
  
  uploadOffersTableHTML = async (products, chatId) => {
    const html = createOffersTable(products);
    const path = this.saveFile(`o-${chatId}`,'html',html);
    //return [this.serverUrl, await upload('./'+path,`offer-table-${chatId}`)];
    //return this.serverUrl+'/'+chatId+'/offers';
    return [this.serverUrl,this.serverUrl+'/'+path];
  }
  
  uploadWishlistTableScreenshot = async (products, chatId) => {
    const image = await takeScreenshotFromHtml(createWishlistTable(products));
    const path = this.saveFile(`w-${chatId}`,'png',image);
    //return [this.serverUrl, await upload('./'+path,`wishlist-${chatId}`)];
    return [this.serverUrl,this.serverUrl+'/'+path];
  };
  
  uploadWishlistTableHTML = async (products, chatId) => {
    const html = createWishlistTable(products);
    const path = this.saveFile(`w-${chatId}`,'html',html);
    //return [this.serverUrl, await upload('./'+path,`wishlist-${chatId}`)];
    //return this.serverUrl+'/'+chatId+'/offers';
    return [this.serverUrl,this.serverUrl+'/'+path];
  };
  
  uploadGroceriesTableScreenshot = async (products,chatId) => {
    const image = await takeScreenshotFromHtml(createGroceriesTable(products));
    const path = this.saveFile(`g-${chatId}`,'png',image,true);
    //return [this.serverUrl, await upload('./'+path,`groceries-table-${chatId}`)];
    return [this.serverUrl,this.serverUrl+'/'+path];
  };  
  
  private saveFile(name,ext,data,showFallback=true){
    const rand = randomstring.generate();
    const basePath = './public/temp/';
    const fileName = `${name}-${rand}.${ext}`;
    const path = `${basePath}${fileName}`;
    fs.writeFileSync(path, data);
    const fileStats = fs.statSync(path);
    const fileSizeInMb = fileStats.size / BYTES_PER_MB;
    if(fileSizeInMb >= MAX_SIZE_IN_MB || showFallback){
      fs.unlink(path,()=>{/**/});
      return 'public/image_fallback.jpg';
    }

    return `public/temp/${fileName}`;
  }
  
}
import * as fs from "fs";

import { takeScreenshotFromHtml } from "../browser";
import { upload } from "./images";
import { createProductTable, createWishlistTable } from "../util";

export  const uploadProductScreenshot = async (products) => {
  let image = await takeScreenshotFromHtml(createProductTable(products));

  fs.writeFileSync("./src/static/image.png", image);
  return await upload("./src/static/image.png");
};

export  const uploadWishlistScreenshot = async (products) => {
  let image = await takeScreenshotFromHtml(createWishlistTable(products));

  fs.writeFileSync("./src/static/wishlist.png", image);
  return 'wishlist.png';
};
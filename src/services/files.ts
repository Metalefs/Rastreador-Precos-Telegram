import * as fs from "fs";

import { takeScreenshotFromHtml } from "../browser";
import { upload } from "../images";
import { createProductTable } from "../util";

export  const uploadProductScreenshot = async (products) => {
  let image = await takeScreenshotFromHtml(createProductTable(products));

  fs.writeFileSync("./src/static/image.png", image);
  return await upload("./src/static/image.png");
};

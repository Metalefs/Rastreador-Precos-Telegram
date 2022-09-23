import * as fs from "fs";
import { takeScreenshotFromHtml } from "./browser";
import { categories } from "./models/categories/detailed";

export function createProductTable(products) {
    const productTableHTML = fs.readFileSync("./src/static/productTable.html", {
        encoding: "utf8",
        flag: "r",
      });

    let HTML = `
    <table class='table table-sm table-striped table-dark'>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>`;
    for (let product of products) {
      if (product.name != "") {
        HTML += `
        <tr>
          <td>${product.name}</td>
          <td>${product.max_price}</td>
        </tr>`;
      }
    }
    HTML += `</tbody>
    </table>`;

    return productTableHTML.replace('{{table}}', HTML)
}

(async function test(){
 
  const products = categories.map(cat=>cat.products).flat().filter(prod=>prod.name != '');

  console.log(products);

  let image = await takeScreenshotFromHtml(createProductTable(products));

  fs.writeFileSync("./src/static/image.png", image);
}
)()
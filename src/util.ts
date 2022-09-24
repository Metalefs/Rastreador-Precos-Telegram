import * as fs from "fs";

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
          <td>${product.max_price || ''}</td>
        </tr>`;
      }
    }
    HTML += `</tbody>
    </table>`;

    return productTableHTML.replace('{{table}}', HTML)
}
export function createWishlistTable(products) {
    const productTableHTML = fs.readFileSync("./src/static/wishlistTable.html", {
        encoding: "utf8",
        flag: "r",
      });

    let HTML = `
    <table class='table table-sm table-striped table-dark'>
      <thead>
        <tr>
          <th>Name</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>`;
    for (let product of products) {
      if (product.name != "") {
        HTML += `
        <tr>
          <td>${product.name}</td>
          <td>${product.date || ''}</td>
        </tr>`;
      }
    }
    HTML += `</tbody>
    </table>`;

    return productTableHTML.replace('{{table}}', HTML)
}
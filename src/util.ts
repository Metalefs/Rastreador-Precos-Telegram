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
          <td>${product.max_price || ""}</td>
        </tr>`;
    }
  }
  HTML += `</tbody>
    </table>`;

  return productTableHTML.replace("{{table}}", HTML);
}
export function createWishlistTable(products: Array<any>) {
  const productTableHTML = fs.readFileSync("./src/static/wishlistTable.html", {
    encoding: "utf8",
    flag: "r",
  });

  let showCategory = false;

  if (products.some((x) => x.hasOwnProperty("category"))) {
    showCategory = true;
  }

  let HTML = `
    <table class='table table-sm table-striped table-dark'>
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Date</th>
          ${showCategory ? "<th>Category</th>" : ""}
        </tr>
      </thead>
      <tbody>`;
  for (let product of products) {
    if (product.name != "") {
      HTML += `
        <tr>
          <td>${product.id}</td>
          <td>${product.name}</td>
          <td>${product.date || ""}</td>
          ${showCategory ? `<td>${product.category ?? ""}</td>` : ""}
        </tr>`;
    }
  }
  HTML += `</tbody>
    </table>`;

  return productTableHTML.replace("{{table}}", HTML);
}

export function splitIntoChunk(arr, chunk) {
  var result:any = [];
  for (let i = 0; i < arr.length; i += chunk) {
    let tempArray;
    tempArray = arr.slice(i, i + chunk);
    result.push(tempArray);
  }
  return result;
}

import * as fs from "fs";

export function createProductTable(products) {
  const productTableHTML = fs.readFileSync("./src/templates/productTable.html", {
    encoding: "utf8",
    flag: "r",
  });

  let showHTML = false;

  if (products.some((x) => x.hasOwnProperty("offer"))) {
    showHTML = true;
  }

  let HTML = `
    <table class='table table-sm table-striped table-dark'>
      <thead>
        <tr>
          <th>Name</th>
          <th>Promotional Price</th>
          <th>Price</th>
          ${showHTML ? "<th>Conteúdo</th>" : ""}
        </tr>
      </thead>
      <tbody>`;
  for (let product of products) {
    if (product.name != "") {
      HTML += `
        <tr>
          <td>${product.name}</td>
          <td>${product.offer?.promoPrice ?? ""}</td>
          <td>${product.offer?.normalPrice ?? ""}</td>
          ${showHTML ? `<td>${product.offer.html ?? ""}</td>` : ""}
        </tr>`;
    }
  }
  HTML += `</tbody>
    </table>`;

  return productTableHTML.replace("__table__", HTML);
}
export function createWishlistTable(products: Array<any>) {
  const productTableHTML = fs.readFileSync("./src/templates/wishlistTable.html", {
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

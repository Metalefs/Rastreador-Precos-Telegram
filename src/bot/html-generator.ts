import * as fs from "fs";

export function createOffersTable(products) {
  const productTableHTML = fs.readFileSync("./src/bot/templates/productTable.html", {
    encoding: "utf8",
    flag: "r",
  });

  let HTML = `
    <table class='table table-sm table-striped table-dark'>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Promoção</th>
          <th>Preço</th>
          <th>Conteúdo</th>
          <th>Quantidade</th>
        </tr>
      </thead>
      <tbody>`;
  for (const product of products) {
    if (product.name != "") {
      HTML += `
        <tr>
          <td>${product.name}</td>
          <td>${product.offer?.promoPrice ?? ""}</td>
          <td>${product.offer?.normalPrice ?? ""}</td>
          <td>${product.offer?.html ?? ""}</td>
          <td>${product?.quantity ?? '1'}</td>
        </tr>`;
    }
  }
  HTML += `</tbody>
    </table>`;

  return productTableHTML.replace("__table__", HTML);
}
export function createWishlistTable(products: Array<any>) {
  const productTableHTML = fs.readFileSync("./src/bot/templates/wishlistTable.html", {
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
          <th>Nome</th>
          <th>Data</th>
          ${showCategory ? "<th>Categoria</th>" : ""}
          <th>Quantidade</th>
        </tr>
      </thead>
      <tbody>`;
  for (const product of products) {
    if (product.name != "") {
      HTML += `
        <tr>
          <td>${product.name}</td>
          <td>${product.date || ""}</td>
          ${showCategory ? `<td>${product.category ?? ""}</td>` : ""}
          <td>${product?.quantity ?? '1'}</td>
        </tr>`;
    }
  }
  HTML += `</tbody>
    </table>`;

  return productTableHTML.replace("{{table}}", HTML);
}
export function createGroceriesTable(products: Array<any>) {
  const productTableHTML = fs.readFileSync("./src/bot/templates/groceriesTable.html", {
    encoding: "utf8",
    flag: "r",
  });

  let showCategory = false;

  if (products.some((x) => x.hasOwnProperty("category"))) {
    showCategory = true;
  }

  let HTML = `
      <div class="table-responsive">
      <table class="table table-sm table-striped table-hover">
        <thead>
          <tr>
            <th>Oferta</th>
            <th>Promoção</th>
            <th>Loja</th>
            <th>Data da busca</th>
            <th>Nome</th>
            <th>Preço</th>
            <th>Quantidade</th>
          </tr>
        </thead>
      <tbody>`;
  for (const product of products) {
    if (product.name != "") {
      HTML += `
        <tr>
          <td>${product?.offer?.html ?? ''}</td>
          <td>${product?.offer?.promoPrice ?? ''}</td>
          <td>${product?.offer?.store ?? ''}</td>
          <td>${product?.date}</td>
          <td>${product?.name}       <a href="/history/${product?.name}">Ver histórico</a></td>
          <td>${product?.offer?.normalPrice ?? ''}</td>
          <td>${product?.quantity ?? '1'}</td>
        </tr>`;
    }
  }
  HTML += `</tbody>
    </table>`;

  return productTableHTML.replace("{{table}}", HTML);
}

export function splitIntoChunk(arr, chunk) {
  const result:any = [];
  for (let i = 0; i < arr.length; i += chunk) {
    const tempArray = arr.slice(i, i + chunk);
    result.push(tempArray);
  }
  return result;
}

import { Db } from "mongodb";

export class ProductsService {
  constructor(private dbconnection:()=>Promise<Db>) {
  }


  list = async () => {
    const products = (await (this.dbconnection)()).collection('products').find().toArray();
    return products;
  };

}

import { Db } from "mongodb";

export class ProductsService {
  constructor(private dbconnection:Db) {
  }

  add = async (product) => {
    await this.dbconnection.collection('products').insertOne(product);
  }

  list = async () => {
    const products =  this.dbconnection.collection('products').find().toArray();
    return products;
  };
  
  addTowishlist = async (product) => {
    await this.dbconnection.collection('wishlist').insertOne({name:product, date: new Date().toDateString()});
  };

  getWishlist = async () => {
    return this.dbconnection.collection('wishlist').find().toArray();
  };

}

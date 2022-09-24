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
    const count = await this.dbconnection.collection('wishlist').countDocuments();
    await this.dbconnection.collection('wishlist').insertOne({name:product, date: new Date().toLocaleString(), id: count});
  };

  removeWishlist = async (id) => {
    const result = await this.dbconnection.collection('wishlist').deleteOne({id:parseInt(id)});
    if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.", id);
    } else {
      console.log("No documents matched the query. Deleted 0 documents.", {id});
    }
  };

  getWishlist = async () => {
    return this.dbconnection.collection('wishlist').find().toArray();
  };
  
  emptyWishlist = async () => {
    return this.dbconnection.collection('wishlist').deleteMany(x=>x);
  };

}

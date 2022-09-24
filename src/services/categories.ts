import { Db } from "mongodb";

export class CategoriesService {
  constructor(private dbconnection:Db) {
  }

  add = async (category) => {
    await this.dbconnection.collection('categories').insertOne(category);
  }

  list = async () => {
    const products =  this.dbconnection.collection('categories').find().toArray();
    return products;
  };

}

import { Db } from "mongodb";

export class BaseService {
  constructor(protected dbconnection:Db, private collection) {
  }

  add = async (expenses) => {
    await this.dbconnection.collection(this.collection).insertOne(expenses);
  }

  list = async () => {
    const expenses =  this.dbconnection.collection(this.collection).find().toArray();
    return expenses;
  };

}

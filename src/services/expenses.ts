import { Db } from "mongodb";

export class ExpensesService {
  constructor(private dbconnection:Db) {
  }

  add = async (expenses) => {
    await this.dbconnection.collection('expenses').insertOne(expenses);
  }

  list = async () => {
    const expenses =  this.dbconnection.collection('expenses').find().toArray();
    return expenses;
  };

}

import { Db } from 'mongodb';

export class BaseService {
  constructor(protected dbconnection: Db, private collection) {}

  add =async (item) => {
    await this.dbconnection.collection(this.collection).insertOne(item);
  };

  list = async () => {
    return this.dbconnection.collection(this.collection).find().toArray();
  };

  find = async (filter) => {
    return this.dbconnection.collection(this.collection).find(filter).toArray();
  };

  update = async (filter, fields) => {
    const options = { upsert: true };

    const updateDoc = {
      $set: fields,
    };

    const result = await this.dbconnection
      .collection(this.collection)
      .updateOne(filter, updateDoc, options);

    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    );
  };
}

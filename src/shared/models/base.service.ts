import { Db } from 'mongodb';

export class BaseService {
  constructor(protected dbconnection: Db, protected collection) {}

  add =async (item) => {
    await this.dbconnection.collection(this.collection).insertOne(item);
  };

  list = async () => {
    return this.dbconnection.collection(this.collection).find().toArray();
  };

  find = async (filter) => {
    return this.dbconnection.collection(this.collection).find(filter).toArray();
  };

  findByChatId = async (chatId) => {
    return this.dbconnection.collection(this.collection).find({ chatId }).toArray();
  };

  findById = async (id) => {
    return this.dbconnection
      .collection(this.collection)
      .find({ id: parseInt(id) })
      .toArray();
  };
  
  getByName = async (name) => {
    return this.dbconnection.collection(this.collection).findOne({ name: name });
  };

  emptyCollection = async () => {
    return this.dbconnection.collection(this.collection).deleteMany((x) => x);
  };
  
  removeByFilter = async (filter) => {
    const result = await this.dbconnection
      .collection(this.collection)
      .deleteOne(filter);
    if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.", filter);
    } else {
      console.log("No documents matched the query. Deleted 0 documents.", {
        filter,
      });
    }
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

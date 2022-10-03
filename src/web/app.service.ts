import { Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import { dbconnection } from '../database';

@Injectable()
export class AppService {
  async getProducts(id): Promise<any> {
    const [db] = await dbconnection();
    return (db as Db)
      .collection('wishlist')
      .find({ chatId: parseInt(id) })
      .toArray();
  }
  async getGroceries(id): Promise<any> {
    const [db] = await dbconnection();
    return (db as Db)
      .collection('groceries')
      .find({ chatId: parseInt(id) })
      .toArray();
  }
  async getPriceHistory(id): Promise<any> {
    const [db] = await dbconnection();
    return (db as Db)
      .collection('priceHistory')
      .find({ product: id })
      .toArray();
  }
  async getUser(id): Promise<any> {
    const [db] = await dbconnection();
    return (db as Db).collection('chatId').findOne({ 'from.id': parseInt(id) });
  }
}

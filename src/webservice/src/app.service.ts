import { Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import { dbconnection } from './database';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  async getProducts(id): Promise<any> {
    const [db] = await dbconnection();
    return (db as Db)
      .collection('wishlist')
      .find({ chatId: parseInt(id) })
      .toArray();
  }
  async getUser(id): Promise<any> {
    const [db] = await dbconnection();
    return (db as Db).collection('chatId').findOne({ 'from.id': parseInt(id) });
  }
}

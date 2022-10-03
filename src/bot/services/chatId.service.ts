import { Db } from "mongodb";
import { BaseService } from "../../shared/models/base.service";

export class ChatIdService extends BaseService {
  constructor(protected dbconnection: Db) {
    super(dbconnection, 'chatId')
  }
}

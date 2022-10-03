import { Db } from "mongodb";
import { BaseService } from "../../shared/models/base.service";

export class FinancesService extends BaseService {
  constructor(protected dbconnection: Db) {
    super(dbconnection, "finances");
  }

  async addExpenseCategory(chatId, category, value){
    await this.update(
      { chatId: chatId },
      {
       [category]: value
      }
    );
  }
}

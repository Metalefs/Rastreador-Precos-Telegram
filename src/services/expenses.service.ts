import { Db } from "mongodb";
import { BaseService } from "../models/base.service";

export class ExpensesService extends BaseService {
  constructor(protected dbconnection: Db) {
    super(dbconnection, "expenses");
  }
}

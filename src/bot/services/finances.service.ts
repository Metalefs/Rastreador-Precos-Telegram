import { Db } from "mongodb";
import { BaseService } from "../../models/base.service";

export class FinancesService extends BaseService {
  constructor(protected dbconnection: Db) {
    super(dbconnection, "finances");
  }
}

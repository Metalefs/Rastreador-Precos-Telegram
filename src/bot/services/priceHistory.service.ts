import { Db } from "mongodb";
import { BaseService } from "../../models/base.service";

export class PriceHistoryService extends BaseService {
  constructor(protected dbconnection: Db) {
    super(dbconnection, "priceHistory");
  }
}

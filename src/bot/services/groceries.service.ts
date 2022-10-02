import { Db } from "mongodb";
import { BaseService } from "../../models/base.service";

export class GroceriesService extends BaseService {
  constructor(protected dbconnection: Db) {
    super(dbconnection, "groceries");
  }
}

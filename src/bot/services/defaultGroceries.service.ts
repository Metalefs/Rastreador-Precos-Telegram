import { Db } from "mongodb";
import { BaseService } from "../../shared/models/base.service";

export class DefaultGroceriesService extends BaseService {
  constructor(protected dbconnection: Db) {
    super(dbconnection, 'default_groceries')
  }
}

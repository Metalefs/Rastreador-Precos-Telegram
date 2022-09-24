import { Db } from "mongodb";
import { BaseService } from "./base.service";

export class CategoriesService extends BaseService{
  constructor(protected dbconnection:Db) {
    super(dbconnection, 'categories')
  }
}

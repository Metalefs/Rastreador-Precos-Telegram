require("dotenv").config();

import { dbconnection } from "./database";
import { scoutGoogleShopping } from "./navigator";


dbconnection().then(async (db) => {
 const main = async (query) => {
    await scoutGoogleShopping(query);
  };
})

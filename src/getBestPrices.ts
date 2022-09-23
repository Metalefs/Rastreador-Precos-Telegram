require("dotenv").config();

import { dbconnection } from "./database";
import { scoutGoogleShopping } from "./navigator";
import moment from "moment";

const main = async (query) => {
  dbconnection().then(async (db) => {
    const lastSearch = await db
      .collection("searches")
      .find()
      .sort("date", -1)
      .toArray()[0];
    let googleOffers;
    
    if (!lastSearch || lastSearch.date <= moment().add(-1, "d")) {
      db.collection("searches").insertOne({
        date: new Date(),
      });

      googleOffers = await scoutGoogleShopping(query);
      db.collection("offers").insertOne(googleOffers);
    } else {
      googleOffers = await db.collection("offers").find().toArray();
    }

    return googleOffers;
  });
};

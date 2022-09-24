require("dotenv").config();

import { scoutGoogleShopping } from "./navigator";
import moment from "moment";
import { Db } from "mongodb";

export class PriceFinder {
  constructor(private dbconnection: Db) {

  }

  getPrices = async(query, force = false) => {
    const lastSearch = await this.dbconnection
      .collection("searches")
      .find()
      .sort("date", -1)
      .toArray()[0];
    let googleOffers;

    if ((!lastSearch || lastSearch.date <= moment().add(-1, "d") || force)) {
      this.dbconnection.collection("searches").insertOne({
        date: new Date(),
      });
      query.forEach(async(q)=>{
        googleOffers = await scoutGoogleShopping(q);
        this.dbconnection.collection("offers").insertOne(googleOffers);
      });
    } else {
      googleOffers = await this.dbconnection.collection("offers").find().toArray();
    }

    return googleOffers;
  }
}
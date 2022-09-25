require("dotenv").config();

import { scoutGoogleShopping } from "./navigator";
import moment from "moment";
import { Db } from "mongodb";

export class PriceFinder {
  constructor(private dbconnection: Db) {

  }

  getPrices = async (query, force = false) => {
    const googleOffers = await scoutGoogleShopping(query);

    await this.dbconnection.collection("offers").insertOne(googleOffers);

    console.log(googleOffers)

    return googleOffers;
  }

  getPricesArray = async (query, force = false) => {
    let offers:any = [];
    const lastSearch = await this.dbconnection
      .collection("searches")
      .find()
      .sort("date", -1)
      .toArray()[0];


    if ((!lastSearch || lastSearch.date <= moment().add(-1, "d") || force)) {
      this.dbconnection.collection("searches").insertOne({
        date: new Date(),
      });

      query.forEach(async q => {
        offers.push(await this.getPrices(q));
      })
      return offers;
    } else {
      return await this.dbconnection.collection("offers").find().toArray();
    }
  }
}
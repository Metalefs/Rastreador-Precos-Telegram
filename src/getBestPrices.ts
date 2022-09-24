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
    let googleOffers:any = [];

    if ((!lastSearch || lastSearch.date <= moment().add(-1, "d") || force)) {
      this.dbconnection.collection("searches").insertOne({
        date: new Date(),
      });
      query.forEach(async(q)=>{
        const result = await scoutGoogleShopping(q);
        googleOffers.push(result);
        console.log(result);
        
        this.dbconnection.collection("offers").insertOne(result);
      });
    } else {
      googleOffers = await this.dbconnection.collection("offers").find().toArray();
    }
    console.log(googleOffers)
    return googleOffers;
  }
}
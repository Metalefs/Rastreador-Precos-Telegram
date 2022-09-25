require("dotenv").config();

import { scoutGoogleShopping } from "./navigator";
import moment from "moment";
import { Db } from "mongodb";

export class PriceFinder {
  constructor(private dbconnection: Db) {}

  getPrices = async (query, force = false) => {
    const googleOffers = await scoutGoogleShopping(query);

    console.log(googleOffers);

    return googleOffers;
  };

  getPricesArray = async (query, force = false) => {
    let offers: any = [];

    query.forEach(async (q) => {
      offers.push(await this.getPrices(q));
    });
    return offers;
  };
}

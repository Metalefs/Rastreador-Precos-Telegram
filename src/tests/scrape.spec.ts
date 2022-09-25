import { dbconnection } from "../database";
import { PriceFinder } from "../getBestPrices";
import {describe, expect, test} from '@jest/globals';
import { MongoClient } from "mongodb";


describe('Scrape', () => {
  test('search xbox series s', async() => {

    const [db, connection, client] = await dbconnection();
    const priceFinder = new PriceFinder(db as any);

    const result = await priceFinder.getPrices('Xbox Series S');

    expect(result).toBeTruthy();

    (client as MongoClient).close()
  },20000);

});
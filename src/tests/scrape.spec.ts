import { dbconnection } from "../database";
import { PriceFinder } from "../getBestPrices";
import {describe, expect, test} from '@jest/globals';
import { MongoClient } from "mongodb";
import * as fs from 'fs';

describe('Scrape', () => {
  test('search xbox series s', async() => {

    const [db, connection, client] = await dbconnection();
    const priceFinder = new PriceFinder(db as any);

    const result = await priceFinder.getPrices('Xbox Series S');

    fs.writeFileSync(`./src/tests/results/scrape/result.json`, JSON.stringify(result));

    expect(result).toBeTruthy();

    (client as MongoClient).close()
  },20000);

});
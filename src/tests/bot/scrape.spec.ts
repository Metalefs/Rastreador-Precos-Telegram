import { dbconnection } from "../../database";
import { PriceFinder } from "../../bot/getBestPrices";
import { describe, expect, test } from '@jest/globals';
import { MongoClient } from "mongodb";
import * as fs from 'fs';

describe('Scrape', () => {
  test.only('search xbox series s', async () => {

    const [db, connection, client] = await dbconnection();
    const priceFinder = new PriceFinder(db as any);

    const result = await priceFinder.getPrices('Xbox Series S');

    fs.writeFileSync(`./src/tests/bot/results/scrape/result.json`, JSON.stringify(result));

    expect(result).toBeTruthy();

    (client as MongoClient).close()
  }, 20000);

  test('search iogurte grego 100g', async () => {

    const [db, connection, client] = await dbconnection();
    const priceFinder = new PriceFinder(db as any);

    const result = await priceFinder.getPrices('iogurte grego 100g', { useMerchants: false });

    fs.writeFileSync(`./src/tests/bot/results/scrape/groceries-result.json`, JSON.stringify(result));

    expect(result).toBeTruthy();

    (client as MongoClient).close()
  }, 20000);

});
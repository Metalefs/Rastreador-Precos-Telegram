import { describe, expect, test } from '@jest/globals';
import { MongoClient } from 'mongodb';
import { dbconnection } from '../database';
import { OfferSearchScheduler } from '../services/offerSearchScheduler';
import { SearchService } from '../services/searchService';


describe('Agenda Offer Search Schedule ', () => {
    test('new search is logged in database', async () => {

        const [db, connection, client] = await dbconnection();
        const offerSearchScheduler = new OfferSearchScheduler(db as any);
        await offerSearchScheduler.start();

        const searchService = new SearchService(db as any);
        expect(await searchService.hasSearchedToday()).toBeTruthy();
        
        await offerSearchScheduler.stop();
        (client as MongoClient).close();

    },20000);
});
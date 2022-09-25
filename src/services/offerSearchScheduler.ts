import { Agenda } from "agenda/es";
import { MongoClient } from "mongodb";
import { SearchService } from "./searchService";

export class OfferSearchScheduler {
  constructor(private mongoClient: MongoClient) {}

  start() {
    const searchService = new SearchService(this.mongoClient.db())

    const agenda = new Agenda({mongo: this.mongoClient});

    agenda.define("search new offers", async (job) => {
      await searchService.search();
    });

    (async function () {
      // IIFE to give access to async/await
      await agenda.start();

      await agenda.every("1 day", "search new offers");
    })();
  }
}

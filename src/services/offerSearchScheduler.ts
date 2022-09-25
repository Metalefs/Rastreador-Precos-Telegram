import { Agenda } from "agenda/es";
import { Db } from "mongodb";
import { mongoConnectionString } from "../database";
import { SearchService } from "./searchService";

export class OfferSearchScheduler {
  agenda;
  constructor(private db: Db) {
    this.agenda = new Agenda({ db: { address: mongoConnectionString+'/agenda' } });
  }

  start() {
    const searchService = new SearchService(this.db)

    this.agenda.define("search new offers", async (job) => {
      await searchService.search();
    });

    (async ()=> {
      // IIFE to give access to async/await
      await this.agenda.start();

      await this.agenda.every("1 day", "search new offers");
    })();
  }

  async stop() {
    const numRemoved = await this.agenda.cancel({ name: "search new offers" });
  }
}

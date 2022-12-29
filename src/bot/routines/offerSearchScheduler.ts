import { Agenda } from 'agenda/es';
import { Db } from 'mongodb';
import { SearchService } from '../services/searchService';
import { MongoClient } from "mongodb";

export class OfferSearchScheduler {
  agenda;
  chats;
  constructor(private db:Db, client: MongoClient, private bot) {
    this.agenda = new Agenda({ mongo: client.db("agenda") });
  }

  start() {
    const searchService = new SearchService(this.db);

    this.agenda.define('search new offers', async (job) => {
      await searchService.search();

      this.chats = await this.db.collection('chatId').distinct('chat.id');

      this.chats.forEach((chat) => {
        console.log(chat);
        this.bot?.sendMessage(
          chat,
          `Acabei de atualizar as suas ofertas. /wishlistoffers ou /groceryoffers para verificar`,
        );
      });
    });

    (async () => {
      // IIFE to give access to async/await
      await this.agenda.start();

      await this.agenda.every('12 hours', 'search new offers');
    })();
  }

  async stop() {
    const numRemoved = await this.agenda.cancel({ name: 'search new offers' });
  }
}

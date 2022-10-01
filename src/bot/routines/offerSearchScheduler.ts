import { Agenda } from 'agenda/es';
import { Db } from 'mongodb';
import { mongoConnectionString } from '../database';
import { SearchService } from '../services/searchService';

export class OfferSearchScheduler {
  agenda;
  chats;
  constructor(private db: Db, private bot) {
    this.agenda = new Agenda({
      db: { address: mongoConnectionString + '/agenda' },
    });
  }

  start() {
    const searchService = new SearchService(this.db);

    this.agenda.define('search new offers', async (job) => {
      await searchService.search();

      this.chats = await this.db.collection('chatId').distinct('chat.id');

      this.chats.forEach((chat) => {
        console.log(chat);
        this.bot.sendMessage(
          chat,
          `Acabei de atualizar as suas ofertas. /wishlistoffers para verificar`,
        );
      });
    });

    (async () => {
      // IIFE to give access to async/await
      await this.agenda.start();

      await this.agenda.every('30 minutes', 'search new offers');
    })();
  }

  async stop() {
    const numRemoved = await this.agenda.cancel({ name: 'search new offers' });
  }
}

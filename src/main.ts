import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import handlebars from 'handlebars';
import * as hbsf from 'handlebars-dateformat';
import { join } from 'path';
import { AppModule } from './web/app.module';
import { initBot } from './bot'

const localtunnel = require("localtunnel");
import { config } from './bot/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  handlebars.registerHelper('dateFormat', hbsf);

  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    prefix: '/public/',
  });
  app.setViewEngine({
    engine: {
      handlebars: require('handlebars'),
    },
    templates: join(__dirname, '..', 'views'),
  });
  
  (async ()=>{
    const tunnel = await localtunnel({ port: 8080, subdomain: config.fileServerUrl});
    console.log(tunnel.url)
    await initBot(tunnel.url);
  
    tunnel.on('close', () => {
      bootstrap()
    });
  })()
  await app.listen(8080);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();

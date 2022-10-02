import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import handlebars from 'handlebars';
import * as hbsf from 'handlebars-dateformat';
import { join } from 'path';
import { AppModule } from './app/app.module';
import { initBot } from './bot'
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
  await initBot();
  await app.listen(8080);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
